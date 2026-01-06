import Image from "next/image";
import getImage from "../../utils/utils";

export default async function UserDetailsPage({ params }) {
  const { id } = await params;

  const response = await fetch(`https://randomuser.me/api/?uuid=${id}`);
  const data = await response.json();

  const user = data.results && data.results.length > 0 ? data.results[0] : null;

  if (!user) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>User not found</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "start",
          marginBottom: "20px",
          textAlign: "start",
        }}
      >
        <Image
          src={getImage(user.name.first)}
          alt={`${user.name.first} ${user.name.last}`}
          width={100}
          height={100}
          style={{ borderRadius: "50%", marginRight: "20px" }}
        />
        <div style={{ textAlign: "start" }}>
          <h1>
            {user.name.title}. {user.name.first} {user.name.last}
          </h1>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
          <p>
            <strong>Cell:</strong> {user.cell}
          </p>
        </div>
      </div>

      <div style={{ textAlign: "start", maxWidth: "400px", width: "100%" }}>
        <h2>Location</h2>
        <p>
          {user.location.street.number} {user.location.street.name}
        </p>
        <p>
          {user.location.city}, {user.location.state} {user.location.postcode}
        </p>
        <p>{user.location.country}</p>
      </div>

      <div style={{ textAlign: "start", maxWidth: "400px", width: "100%" }}>
        <h2>Additional Info</h2>
        <p>
          <strong>Gender:</strong> {user.gender}
        </p>
        <p>
          <strong>Age:</strong> {user.dob.age}
        </p>
        <p>
          <strong>Birth Date:</strong>{" "}
          {new Date(user.dob.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Registered:</strong>{" "}
          {new Date(user.registered.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
