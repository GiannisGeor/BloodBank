import { Tabs } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import Inventory from "../Inventory";
import Donors from "./Donors";
import Hospitals from "./Hospitals";
import Organizations from "./Organizations";
import InventoryTable from "../../components/InventoryTable";

function Profile() {
  const { currentUser } = useSelector((state) => state.users);

  return (
    <div className="px-2 sm:px-0">
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
            <Tabs.TabPane tab="Δωρεές" key="4">
              <InventoryTable
                filters={{
                  inventoryType: "in",
                  donor: currentUser._id,
                }}
                userType="donor"
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Οργανισμοί" key="5">
              <Organizations userType="donor" />
            </Tabs.TabPane>
          </>
        )}

        {currentUser.userType === "hospital" && (
          <>
            <Tabs.TabPane tab="Κατανάλωση" key="6">
              <InventoryTable
                filters={{
                  inventoryType: "out",
                  hospital: currentUser._id,
                }}
                userType="hospital"
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Οργανισμοί" key="7">
              <Organizations userType="hospital" />
            </Tabs.TabPane>
          </>
        )}
      </Tabs>
    </div>
  );
}

export default Profile;
