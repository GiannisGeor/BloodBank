import { current } from "@reduxjs/toolkit";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllBloodBroupsInInventory } from "../../apicalls/dashboard";
import { SetLoading } from "../../redux/loadersSlice";
import { message } from "antd";
import { getLoggedinUserName } from "../../utils/helpers";

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
    "#016B61",
    "#19183B",
    "#FF9013",
    "#1C352D",
    "#043915",
    "#662222",
    "#3C467B",
    "#222831",
  ];
  return (
    <div>
      <span className="text-primary text-2xl">
        Καλώς ήρθες {getLoggedinUserName(currentUser)}
      </span>
      <div className="grid grid-cols-4 gap-5 mt-5">
        {bloodGroupsData.map((bloodGroup, index) => {
          const color = colours[index];
          return (
            <div
              className={`p-5 flex justify-between text-white rounded items-centered`}
              style={{ backgroundColor: color }}
            >
              <h1 className="text-5xl uppercase">{bloodGroup.bloodGroup}</h1>
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
    </div>
  );
}

export default Home;
