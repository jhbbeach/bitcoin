const remote = require('electron').remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

//渲染进程
const ipc = require('electron').ipcRenderer;

var menu = new Menu.buildFromTemplate([
    {
        label: '菜单1',
        submenu: [
            {
                label: '打开新窗口2',
                click: function(){
                    ipc.send('zqz-show') //注册的指令。send到主进程index.js中。
                }
            }
        ]
    }
])

Menu.setApplicationMenu(menu);