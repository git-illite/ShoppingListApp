const electron = require('electron')
const url = require('url')
const path = require('path')

const {app, BrowserWindow, Menu, ipcMain} = electron


//Set Environment
process.env.NODE_ENV = 'production'

let mainWindow;
let addWindow

//listen for app to be ready
app.on('ready', function(){
    //creates a new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })

    //load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes:true,
    })) // file://dirname/mainWindow.html

    //quit app when closed
    mainWindow.on('closed', function(){
        app.quit()
    })

    //build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)

    //insert menu
    Menu.setApplicationMenu(mainMenu)


})

// ADD WINDOW
function createAddWindow(){
//creates a new window
addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add shopping list item',
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
    }
})

//load html into window
addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes:true,
})) // file://dirname/addWindow.html

    //Handle garbage collection
    addWindow.on('closed', function(){
       addWindow = null;
    })
}

//catch item added
ipcMain.on('item:add', function(e,item){
    //console.log(item)
    mainWindow.webContents.send('item:add',item)
    addWindow.close()
})

//menu template
const mainMenuTemplate = [
    {
    label: 'File',
    submenu:[
        {
            label: 'Add Item',
            click(){
                createAddWindow();
            }
        },
        {
            label: 'Clear Items',
            click(){
                mainWindow.webContents.send('item:clear')
            }
        },
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click(){
                app.quit();
            }
        }
        ]
    }
]

//handle mac add empty object
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({})
}

//handle developer tools menu
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
            submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools()
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}