import React from "react";
import {
  GetAllOrganizationsOfADonor,
  GetAllOrganizationsOfAHospital,
} from "../../../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import { message, Modal, Table } from "antd";
import { getDateFormat } from "../../../utils/helpers";
import InventoryTable from "../../../components/InventoryTable";

function Organizations({ userType }) {
  const [showHistoryModal, setShowHistoryModal] = React.useState(false);
  const { currentUser } = useSelector((state) => state.users);
  const [selectedOrganization, setSelectedOrganization] = React.useState(null);
  const [data, setData] = React.useState([]);
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      let response = null;
      if (userType === "hospital") {
        response = await GetAllOrganizationsOfAHospital();
      } else {
        response = await GetAllOrganizationsOfADonor();
      }
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
      title: "Όνομα",
      dataIndex: "organizationName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Τηλέφωνο",
      dataIndex: "phone",
    },
    {
      title: "Οδός",
      dataIndex: "address",
    },
    {
      title: "Ημερομηνία Δημιουργίας",
      dataIndex: "createdAt",
      render: (text) => getDateFormat(text),
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: (text, record) => (
        <span
          className="underline text-md cursor-pointer"
          onClick={() => {
            setSelectedOrganization(record);
            setShowHistoryModal(true);
          }}
        >
          Ιστορικό
        </span>
      ),
    },
  ];

  React.useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <Table columns={columns} dataSource={data} />
      {showHistoryModal && (
        <Modal
          title={`${
            userType === "donor" ? "Ιστορικό Δωρεών" : "Ιστορικό Κατανάλωσης"
          } σε ${selectedOrganization.organizationName}`}
          centered
          open={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          width={1000}
          onCancel={() => setShowHistoryModal(false)}
        >
          <InventoryTable
            filters={{
              organization: selectedOrganization._id,
              [userType]: currentUser._id,
            }}
          />
        </Modal>
      )}
    </div>
  );
}

export default Organizations;
