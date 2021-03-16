import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { Select, FormControl, MenuItem, TextField } from "@material-ui/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import "./styles.css"
import { RolllStateType } from "shared/models/roll"

type ItemType = RolllStateType | "all"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [studentsData, setStudentsData] = useState<Person[]>([])
  const [studDataWithStatus, setstudDataWithStatus] = useState<Person[]>([])
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<string>("asc")
  const [sortValue, setSortValue] = useState<string>("firstname")
  const [presentCount, setPresentCount] = useState<number>(0)
  const [lateCount, setLateCount] = useState<number>(0)
  const [absentCount, setAbsentCount] = useState<number>(0)

  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    if (studentsData.length === 0 && data?.students && !isSearching) {
      const studentsDataWithType: Person[] = data.students.map((student) => {
        return { ...student, type: "unmark" }
      })
      setStudentsData(studentsDataWithType)
      setstudDataWithStatus(studentsDataWithType)
    }
  }, [data, studentsData, isSearching])

  // Tool bar action method ==> roll and sort actions
  const onToolbarAction = (action: ToolbarAction, value: string | undefined) => {
    switch (action.toLowerCase()) {
      case "roll":
        setIsRollMode(true)
        break
      case "sort":
        sortStudents(value)
        break
      default:
        return
    }
  }

  // Tool bar action ==> Exit action
  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  // Sorting Students array based on the value and the order of sorting chosen
  const sortStudents = (value: string | undefined) => {
    // setting the order of sorting
    if (value) {
      setSortBy(value)
    }
    // When in searching mode, do the sorting from the filtered data
    if (studentsData && studentsData.length) {
      if (sortValue.toLowerCase() === "firstname") {
        const sortedStudentsData = [...studentsData].sort((a, b) => (a.first_name > b.first_name ? 1 : b.first_name > a.first_name ? -1 : 0))
        sortBy.toLowerCase() === "asc" ? setStudentsData(sortedStudentsData) : setStudentsData(sortedStudentsData.reverse())
      } else {
        const sortedStudentsData = [...studentsData].sort((a, b) => (a.last_name > b.last_name ? 1 : b.last_name > a.last_name ? -1 : 0))
        sortBy.toLowerCase() === "asc" ? setStudentsData(sortedStudentsData) : setStudentsData(sortedStudentsData.reverse())
      }
    }
  }

  // Select dropdown value change ==> first name / last name
  const handleSelectChange = (event: { target: { value: any }; stopPropagation: () => void }) => {
    const { value } = event.target
    setSortValue(value)
    event.stopPropagation()
  }

  // TrimString method to remove spaces from the
  const trimString = (str: string) => str?.replace(/^\s\s*/, "").replace(/\s\s*$/, "")

  // Search Functionality
  const onInputSearch = (event: { target: { value: any } }) => {
    if (data?.students) {
      setIsSearching(true)
      let searchedValue = trimString(event.target.value)
      let searchedStudentsData: React.SetStateAction<Person[] | null> = []
      if (searchedValue || searchedValue === "") {
        searchedStudentsData = studDataWithStatus.filter((student, index) => {
          return (student.first_name + " " + student.last_name)?.toLowerCase().includes(searchedValue.toLowerCase())
        })
      } else {
        searchedStudentsData = []
      }
      setStudentsData(searchedStudentsData)
    }
  }

  // Students data update on clicking the buttons
  const updateStudentsData = (newState: string, student: Person) => {
    const statusStudentsData: any = studentsData.map((item, index) => {
      if (item.id === student.id) {
        return { ...item, type: newState }
      } else {
        return { ...item }
      }
    })
    setStudentsData(statusStudentsData)
    setstudDataWithStatus(statusStudentsData)
    updateStatusCounts(statusStudentsData)
  }

  // updating the state values of status counts
  const updateStatusCounts = (statusStudentsData: Person[]) => {
    const studentsPresent = statusStudentsData.filter((studentrec) => {
      return studentrec?.type === "present"
    })
    const studentsAbsent = statusStudentsData.filter((studentrec) => {
      return studentrec?.type === "absent"
    })
    const studentsLate = statusStudentsData.filter((studentrec) => {
      return studentrec?.type === "late"
    })
    setPresentCount(studentsPresent.length)
    setAbsentCount(studentsAbsent.length)
    setLateCount(studentsLate.length)
  }

  // filtering record based on type value
  const onStatusFilter = (type: ItemType) => {
    if (type && type !== "all" && type !== "unmark") {
      const filteredStudentsData = studDataWithStatus.filter((student) => {
        return student.type === type
      })
      setStudentsData(filteredStudentsData)
    } else {
      setStudentsData(studDataWithStatus)
    }
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} sortValue={sortValue} onSelectChange={handleSelectChange} sortBy={sortBy} onSearch={onInputSearch} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && studentsData && studentsData.length && (
          <>
            {studentsData.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} updateStudentsData={updateStudentsData} />
            ))}
          </>
        )}
        {loadState === "loaded" && !Boolean(studentsData.length) && (
          <CenteredContainer>
            <div>No matching results found</div>
          </CenteredContainer>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay
        isActive={isRollMode}
        onItemClick={onActiveRollAction}
        totalStudentsCount={data?.students ? data.students.length : 0}
        present={presentCount}
        absent={absentCount}
        late={lateCount}
        onStatusFilter={onStatusFilter}
      />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  sortValue: string
  onSelectChange: (event: React.ChangeEvent<{ value: unknown }>) => void
  sortBy: string
  onSearch: (event: { target: { value: any } }) => void
}

const Toolbar: React.FC<ToolbarProps> = ({ onItemClick, sortValue, onSelectChange, sortBy, onSearch }: ToolbarProps) => {
  return (
    <S.ToolbarContainer>
      <div className="column-1" onClick={() => onItemClick("sort")}>
        <FormControl>
          <Select value={sortValue} id="simple-select" defaultValue="firstname" onChange={onSelectChange} className="custom-select">
            <MenuItem value="firstname">First Name</MenuItem>
            <MenuItem value="lastname">Last Name</MenuItem>
          </Select>
        </FormControl>
        {sortBy === "desc" ? (
          <span className="sort-icon ascending" onClick={() => onItemClick("sort", "asc")}>
            <FontAwesomeIcon icon="sort-alpha-down-alt" />
          </span>
        ) : (
          <span className="sort-icon descending" onClick={() => onItemClick("sort", "desc")}>
            <FontAwesomeIcon icon="sort-alpha-down" />
          </span>
        )}
      </div>
      <div className="search-container">
        <TextField autoFocus id="search" placeholder="Search" type="text" onChange={onSearch} />
      </div>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
