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
    if (currentUser) {
      getData();
    }
  }, [currentUser?._id]);

  const colours = [
    "#657C6A",
    "#3C7B64",
    "#3C5D7B",
    "#1C352D",
    "#8C1007",
    "#8A93C6",
    "#3C467B",
    "#222831",
  ];
  return (
    <div className="px-2 sm:px-0">
      {currentUser.userType === "organization" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-5 mt-2">
            {bloodGroupsData.map((bloodGroup, index) => {
              const color = colours[index];
              return (
                <div
                  key={index}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between text-white rounded items-start sm:items-center gap-3"
                  style={{ backgroundColor: color }}
                >
                  <h1 className="text-4xl sm:text-5xl uppercase">
                    {bloodGroup.bloodGroup}
                  </h1>
                  <div className="flex flex-col justify-between gap-2 w-full sm:w-auto">
                    <div className="flex justify-between">
                      <span className="text-xl sm:text-2xl">Σύνολο</span>
                      <span className="text-sm sm:text-base">
                        {bloodGroup.totalIn} ml
                      </span>
                    </div>
                    <div className="flex justify-between gap-3 sm:gap-5">
                      <span className="text-sm sm:text-base">Σύνολο Εκτός</span>
                      <span className="text-sm sm:text-base">
                        {bloodGroup.totalOut} ml
                      </span>
                    </div>
                    <div className="flex justify-between gap-3 sm:gap-5">
                      <span className="text-sm sm:text-base">Διαθέσιμο</span>
                      <span className="text-sm sm:text-base">
                        {bloodGroup.available} ml
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <span className="text-lg sm:text-xl text-grey-700 font-semibold block mb-3">
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
          <span className="text-lg sm:text-xl text-grey-700 font-semibold block mb-3 mt-5">
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
          <span className="text-lg sm:text-xl text-grey-700 font-semibold block mb-3 mt-5">
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
