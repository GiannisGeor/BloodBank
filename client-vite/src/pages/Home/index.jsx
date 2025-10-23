import { current } from "@reduxjs/toolkit";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllBloodBroupsInInventory } from "../../apicalls/dashboard";
import { SetLoading } from "../../redux/loadersSlice";
import { message } from "antd";
import { getLoggedinUserName } from "../../utils/helpers";
import InventoryTable from "../../components/InventoryTable";

function Home() {
  const { currentUser } = useSelector((state) => state.users);
  const [bloodGroupsData = [], setBloodGroupData] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllBloodBroupsInInventory();
      dispatch(SetLoading(false));
      if (response.success) {
        setBloodGroupData(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const colours = [
    "#7B5C3C",
    "#3C7B64",
    " #3C5D7B ",
    "#1C352D",
    "#FA812F",
    "#8A93C6",
    "#3C467B",
    "#222831",
  ];
  return (
    <div>
      {currentUser.userType === "organization" && (
        <>
          <div className="grid grid-cols-4 gap-5 mb-5 mt-2">
            {bloodGroupsData.map((bloodGroup, index) => {
              const color = colours[index];
              return (
                <div
                  className={`p-5 flex justify-between text-white rounded items-centered`}
                  style={{ backgroundColor: color }}
                >
                  <h1 className="text-5xl uppercase">
                    {bloodGroup.bloodGroup}
                  </h1>
                  <div className="flex flex-col justify-between gap-2">
                    <div className="flex justify-between">
                      <span className="text-2xl">Σύνολο</span>
                      <span>{bloodGroup.totalIn} ml</span>
                    </div>
                    <div className="flex justify-between gap-5">
                      <span>Σύνολο Εκτός</span>
                      <span>{bloodGroup.totalOut} ml</span>
                    </div>
                    <div className="flex justify-between gap-5">
                      <span>Διαθέσιμο</span>
                      <span>{bloodGroup.available} ml</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <span className="text-xl text-grey-700 font-semibold">
            Το πρόσφατο απόθεμα σας
          </span>

          <InventoryTable
            filters={{
              organization: currentUser._id,
            }}
            limit={5}
            userType={currentUser.userType}
          />
        </>
      )}
      {currentUser.userType === "donor" && (
        <div>
          <span className="text-xl text-grey-700 font-semibold mt-5">
            Το πρόσφατο απόθεμα σας
          </span>
          <InventoryTable
            filters={{
              donor: currentUser._id,
            }}
            limit={5}
            userType={currentUser.userType}
          />
        </div>
      )}

      {currentUser.userType === "hospital" && (
        <div>
          <span className="text-xl text-grey-700 font-semibold mt-5">
            Τα πρόσφατα αιτήματα σας / Καταναλώσεις
          </span>
          <InventoryTable
            filters={{
              hospital: currentUser._id,
            }}
            limit={5}
            userType={currentUser.userType}
          />
        </div>
      )}
    </div>
  );
}

export default Home;
