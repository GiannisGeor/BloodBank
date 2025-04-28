import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import React from "react";
import { useSelector } from "react-redux";
import Inventory from "../Inventory";

function Profile() {
  const { currentUser } = useSelector((state) => state.users);

  return (
    <div>
      <Tabs>
        {currentUser.userType === "organization" && (
          <>
            <Tabs.TabPane tab="Απόθεμα" key="1">
              <Inventory />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Αιμοδότες" key="2"></Tabs.TabPane>
            <Tabs.TabPane tab="Νοσοκομεία" key="3"></Tabs.TabPane>
          </>
        )}
      </Tabs>
    </div>
  );
}

export default Profile;
