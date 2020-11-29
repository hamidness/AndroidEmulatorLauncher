import { Menu, MenuItem } from "electron";

export const MENU_ID_SHOW_LOGS = "SHOW_LOG";

export const createApplicationMenu = (
  menuSelectedCallback: (menuItem: MenuItem) => void
) => {
  const handleLogsClick = (menuItem: MenuItem) => {
    menuSelectedCallback(menuItem);
  };

  const template = [
    {
      label: "View",
      submenu: [
        {
          id: MENU_ID_SHOW_LOGS,
          label: "Logs",
          accelerator: "CommandOrControl+L",
          click: handleLogsClick,
        },
      ],
    },
  ];

  return Menu.buildFromTemplate(template);
};
