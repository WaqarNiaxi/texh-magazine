import React from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

const Sidebar = () => {
  return (
    <ProSidebar>
      <Menu iconShape="square">
        <MenuItem icon={<i className="fa fa-home"></i>}>Home</MenuItem>
        <MenuItem icon={<i className="fa fa-user"></i>}>Profile</MenuItem>
        <SubMenu title="Services" icon={<i className="fa fa-cogs"></i>}>
          <MenuItem>Web Design</MenuItem>
          <MenuItem>SEO</MenuItem>
          <MenuItem>Marketing</MenuItem>
        </SubMenu>
        <MenuItem icon={<i className="fa fa-cogs"></i>}>Settings</MenuItem>
      </Menu>
    </ProSidebar>
  );
};

export default Sidebar; // Default export
