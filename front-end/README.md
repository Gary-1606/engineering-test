# Front End Engineering Test
At Boardingware, most of our services are written in Typescript/Javascript/Swift. New features on the web is written in React with Typescript nowadays. This project has a similar setup as some of our main web apps in technologies used as well as the structure of the application. So hopefully this would give you a idea of what is like to be working on the web team at Boardingware as you working on this project.

## Technology
This project is mainly written in Typescript with React. If you are not  familar with Typescript, you can check out this quick start guide [here](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html).

We use [styled-component](https://styled-components.com/docs/basics#getting-started) for styling in this project. Feel free to use `css` or `sass` if you are more comfortable of using them.

This project also includes [material-ui](https://material-ui.com/components/buttons/) and [react-fontawesome](https://fontawesome.com/how-to-use/on-the-web/using-with/react). You may use any of the components/icons from these packages.

## How to run
You will need to have Node **10.16.0** or later on your local development machine. You can use [nvm](https://github.com/creationix/nvm#installation) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) to switch Node versions between different projects.

### First install all dependencies
#### Yarn
```sh
cd front-end && yarn
```

#### npm
```sh
cd front-end && npm i
```

### To start the local server
#### Yarn
```sh
cd front-end && yarn start
```

#### npm
```sh
cd front-end && npm start
```

### Open app in browser
Once the app is compiled and bundled successfully you should see this screen in your browser. This would be your starting point of the project.
![App home page](./../screenshots/01_app_home.png)

## Project structure
Open the project in VSCode as a workspace and install the recommented plugins:

- `vscode-eslint` for linting
- `prettier-vscode` for formatting
- `vscode-styled-components` for auto-completing and syntax highlighting of styled-components code

You should see the project is structured as follows:

```
.
└── front-end
    └── src
        ├── api
        ├── assets
        │   └── images
        ├── shared
        │   ├── components
        │   ├── helpers
        │   ├── hooks
        │   ├── interfaces
        │   ├── models
        │   └── styles
        └── staff-app
```

### src/api

This is the place for all "backend routes". There is no actual backend with database connection for this project. The routes in here use `localStorage` to store data, and will return a `Promise` with data that will be resolved at random timeout between 0.5 to 2 seconds. Some of the routes would also return unsuccessful responses to simulate the real world scenario.

### src/assets

A place for all kinds of assets used in code such as images.

### src/shared

This folder contains some of the shared components/hooks/styles across multiple apps.

For example there is a `useApi` custom hook under `src/shared/hooks` to simplify the communication with the backend. You need to specify the url (and params for `POST`) in the `useApi` params. It will return you the nessary function and state you need to display the data returned from the backend as well as handling of loading and error state.

```tsx
const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "route" })
```

### src/staff-app

This is the React app for staff users. We also have apps for other user types such as students or parents but we do not need them for this project.

## Tasks
### 1. Implement search and sort of students
First implement a efficient way to sort and search the list of students. Please update "First Name" section of the toolbar with a sort toggle (switch between ascending or descending order) as well as a way to switch between sort by first name or last name. Then replace the "Search" with an input to allow users to search by name.

![App tool bar](./../screenshots/02_toolbar.png)

### 2. Displaying a roll summary
Clicking on "Start Roll" button will enter the roll mode which would display a roll state icon at the end of each student in the list. You can click on the icon to switch between "Present", "Late", "Absent" state. In this mode, you will also see a dark blue overlay shown at the bottom of the page which displays the summary of different roll states and the number of students. They all showing 0 at the moment as it hasn't been implemented. Please update it to show the correct number.

![Roll mode](./../screenshots/03_roll_mode.png)
### 3. Filter students based on roll state
When clicking on each roll state icon, it should filter the list of students to only the ones with the matching roll state. Please implement a way to filter students based on roll state. You may update how we store the list of students if you haven't done so in previous steps (you can continue with using states in React or using [Context](https://reactjs.org/docs/context.html) or using whichever state management library you most familar with).

### 4. Save the current roll and display it in activity page
Finally once we done with this roll, we can click on the "Complete" button to save a snapshot of the roll (which student is in what roll state). Please call the `save-roll` route with necessary params in order to save this roll.

Once the roll has been saved, you can call the `get-activities` route to get list of rolls we have completed. Please implement the ui for displaying list of completed rolls in the activity page.
