"use client";

import styles from "@/app/page.module.css";
import { useState } from "react";
import ViewSubmittedForm from "./components/ViewForm";
import AlertDialog from "./components/AleartDialog";

export default function FormSection() {
  const [fromMap, setFormMap] = useState(null);

  const [formValues, setFormValues] = useState({
    fname: "",
    lname: "",
    fage: "",
    fphone: "",
    femail: "",
    fcolor: "#FFFFFF",
    flocation: "",
    fpincode: "",
    fgender: "",
  });
  const [dialog, setDialog] = useState({
    open: false,
    message: "",
  });
  async function createUserData(formData) {
    const age = formData.get("fage");
    const pincode = formData.get("fpincode");

    if (formValues.fage.length > 2) {
      setDialog({
        open: true,
        message: "Age must be exactly 2 digits",
      });
      return;
    }

    if (formValues.fpincode.length > 6) {
      setDialog({
        open: true,
        message: "Pincode must be exactly 6 digits",
      });
      return;
    }

    const rawFormData = {
      firstName: formData.get("fname"),
      LastName: formData.get("lname"),
      email: formData.get("femail"),
      color: formData.get("fcolor"),
      age: age,
      pincode: pincode,
      location: formData.get("flocation"),
      phone: formData.get("fphone"),
      gender: formData.get("fgender"),
    };
    setFormMap(rawFormData);
  }

  return (
    <>
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.intro}>
            <h2>
              {fromMap ? "Form Submitted Successfully" : "Form Submission Page"}
            </h2>
            <p>
              {fromMap
                ? "Your form has been successfully submitted."
                : "This page will let you submit a form with different details and showcase your selected or input data in a neat formatted way"}
            </p>
            {fromMap ? (
              <ViewSubmittedForm
                fromMap={fromMap}
                onBack={() => setFormMap(null)}
              />
            ) : (
              <form action={createUserData} className={styles.formSection}>
                <FormInputBuilder
                  id={"fname"}
                  labelName="First Name"
                  value={formValues.fname}
                  type={"text"}
                  onChange={(id, val) =>
                    setFormValues((p) => ({ ...p, [id]: val }))
                  }
                />
                <FormInputBuilder
                  id={"lname"}
                  value={formValues.lname}
                  labelName="Last Name"
                  type={"text"}
                  onChange={(id, val) =>
                    setFormValues((p) => ({ ...p, [id]: val }))
                  }
                />
                <FormInputBuilder
                  id={"fage"}
                  value={formValues.fage}
                  labelName="Age"
                  type={"number"}
                  maxLength={2}
                  onChange={(id, val) =>
                    setFormValues((p) => ({ ...p, [id]: val }))
                  }
                />
                <FormInputBuilder
                  id={"fphone"}
                  value={formValues.fphone}
                  labelName="Phone"
                  type={"number"}
                  maxLength={10}
                  onChange={(id, val) =>
                    setFormValues((p) => ({ ...p, [id]: val }))
                  }
                />
                <FormDropDownBuilder
                  id={"fgender"}
                  value={formValues.fgender}
                  labelName="Gender"
                  items={["Male", "Female", "Others"]}
                  onChange={(id, val) =>
                    setFormValues((p) => ({ ...p, [id]: val }))
                  }
                />
                <FormInputBuilder
                  id={"femail"}
                  value={formValues.femail}
                  labelName="Email"
                  type={"email"}
                  onChange={(id, val) =>
                    setFormValues((p) => ({ ...p, [id]: val }))
                  }
                />
                <FormInputBuilder
                  id={"fcolor"}
                  value={formValues.fcolor}
                  labelName="Favorite Color"
                  type={"color"}
                  onChange={(id, val) =>
                    setFormValues((p) => ({ ...p, [id]: val }))
                  }
                />
                <FormInputBuilder
                  id={"flocation"}
                  value={formValues.flocation}
                  labelName="Location"
                  type={"text"}
                  onChange={(id, val) =>
                    setFormValues((p) => ({ ...p, [id]: val }))
                  }
                />
                <FormInputBuilder
                  id={"fpincode"}
                  labelName="Pincode"
                  type={"number"}
                  value={formValues.fpincode}
                  maxLength={6}
                  onChange={(id, val) =>
                    setFormValues((p) => ({ ...p, [id]: val }))
                  }
                />
                <button type="submit">Submit</button>
              </form>
            )}
          </div>
          <AlertDialog
            open={dialog.open}
            message={dialog.message}
            onClose={() => setDialog({ open: false, message: "" })}
          />
        </main>
      </div>
    </>
  );
}

function FormDropDownBuilder({ id, labelName, value, onChange, items }) {
  return (
    <div className={styles.formField}>
      <label htmlFor={id}>{labelName}:</label>
      <select
        name={labelName}
        id={id}
        onChange={(e) => {
          let val = e.target.value;
          onChange(id, val);
        }}
      >
        {items.map((e) => (
          <option value={e}>{e}</option>
        ))}
      </select>
    </div>
  );
}

function FormInputBuilder({ id, labelName, type, value, onChange, maxLength }) {
  const isNumeric = ["fage", "fpincode", "fphone"].includes(id);

  return (
    <div className={styles.formField}>
      <label htmlFor={id}>{labelName}</label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        maxLength={maxLength}
        inputMode={isNumeric ? "numeric" : undefined}
        pattern={isNumeric ? "[0-9]*" : undefined}
        onChange={(e) => {
          let val = e.target.value;
          if (isNumeric) {
            val = val.replace(/\D/g, "");
          }
          onChange(id, val);
        }}
      />
    </div>
  );
}
