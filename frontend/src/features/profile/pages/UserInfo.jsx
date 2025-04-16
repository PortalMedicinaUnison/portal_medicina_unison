import React from "react";
import { useEffect, useState } from "react";
import { useUser } from "../../../contexts/UserContext";
import UserInfo from "../components/UserInfo.jsx";
import Layout from "../../../Layout";

function UserPage() {
  return (
      <Layout>
        <UserInfo/>
      </Layout>
  );
}

export default UserPage;