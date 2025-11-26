import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { message, Table } from "antd";
import { GetAllDonorsOfAnOrganization } from "../../../apicalls/users";
import { SetLoading } from "../../../redux/loadersSlice";
import { getDateFormat } from "../../../utils/helpers";

function Donors() {
  const [data, setData] = React.useState([]);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.users);

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllDonorsOfAnOrganization();
      dispatch(SetLoading(false));
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text) => getDateFormat(text),
    },
  ];

  React.useEffect(() => {
    if (currentUser) {
      getData();
    }
  }, [currentUser?._id]);

  return (
    <div className="px-2 sm:px-0">
      <div className="overflow-x-auto">
        <Table columns={columns} dataSource={data} scroll={{ x: 800 }} />
      </div>
    </div>
  );
}

export default Donors;
