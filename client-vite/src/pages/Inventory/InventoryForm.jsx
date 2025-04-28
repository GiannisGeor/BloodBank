import { Form, Modal, Radio } from "antd";
import React, { useState } from "react";

function InventoryForm({ open, setOpen, reloadData }) {
  const [inventoryType, setInventoryType] = useState("in");

  return (
    <Modal
      title="Προσθήκη αποθέματος"
      open={open}
      onCancel={() => setOpen(false)}
      centered
    >
      <Form layout="vertical">
        <Form.Item label="Τύπος αποθέματος">
          <Radio.Group
            value={inventoryType}
            onChange={(e) => setInventoryType(e.target.value)}
          >
            <Radio value="in">Εισερχόμενα</Radio>
            <Radio value="out">Εξερχόμενα</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Ομάδα Αίματος" name="bloodGroup">
          <select name="" id="">
            <option value="">A+</option>
            <option value="">A-</option>
            <option value="">B+</option>
            <option value="">B-</option>
            <option value="">AB+</option>
            <option value="">AB-</option>
            <option value="">O+</option>
            <option value="">O-</option>
          </select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default InventoryForm;
