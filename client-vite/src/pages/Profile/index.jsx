import { Tabs } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import Inventory from "../Inventory";
import Donors from "./Donors";
import Hospitals from "./Hospitals";
import Organizations from "./Organizations";

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
            <Tabs.TabPane tab="Αιμοδότες" key="2">
              <Donors />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Νοσοκομεία" key="3">
              <Hospitals />
            </Tabs.TabPane>
          </>
        )}

        {currentUser.userType === "donor" && (
          <>
            <Tabs.TabPane tab="Δωρεές" key="3"></Tabs.TabPane>
            <Tabs.TabPane tab="Οργανισμοί" key="3">
              <Organizations />
            </Tabs.TabPane>
          </>
        )}
      </Tabs>
    </div>
  );
}

export default Profile;
