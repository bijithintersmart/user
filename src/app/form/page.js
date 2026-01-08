import styles from "@/app/page.module.css";

export default function FormSection() {
  return (
    <>
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.intro}>
            <h2>Form Submission Page</h2>
            <p>
              This page will let you submit a form with different details and
              showcase your selected or input data in a neat formatted way
            </p>
            <form action="/" className={styles.formSection}>
              <FormBuilder id={"fname"} labelName="First Name" type={"text"} />
              <FormBuilder id={"lname"} labelName="Last Name" type={"text"} />
              <FormBuilder id={"fcolor"} labelName="Favorite Color" type={"color"} />
              <FormBuilder id={"fage"} labelName="Age" type={"number"} />
              <FormBuilder id={"femail"} labelName="Email" type={"email"} />
              <button type="submit">Submit</button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

function FormBuilder({id, labelName, type}) {
  return (
    <div className={styles.formField}>
      <label htmlFor={id}>{labelName}</label>
      <input name={id} id={id} type={type} />
    </div>
  );
}
