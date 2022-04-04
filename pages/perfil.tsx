import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function perfil() {
  const { user } = useContext(AuthContext);
  return <div>Meu perfil: {user?.email} </div>;
}
