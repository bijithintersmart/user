"use client";
import FormInputBuilder from "@/components/FromInputBuilder";
import { useCount } from "../../state/CountState";
import styles from "@/app/page.module.css";
export default function Page() {
  const count = useCount((state) => state.count);
  const increaseCount = useCount((state) => state.increaseCount);
  const decreaseCount = useCount((state) => state.decreaseCount);
  const changeCount = useCount((state) => state.updateCount);

  function updateCount(formData) {
    const count = formData.get("count");
    changeCount(count);
  }

  return (
    <center>
      <h1>State Change</h1>
      <h2>{count}</h2>
      <button onClick={increaseCount}>+</button>
      <button onClick={decreaseCount}>-</button>
      <form action={updateCount} className={styles.formSection}>
        <FormInputBuilder id={"count"} labelName="Count" type={"number"} />
        <button type="submit">Update</button>
      </form>
    </center>
  );
}
