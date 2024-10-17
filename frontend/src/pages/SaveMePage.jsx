import { Routes, Route } from "react-router-dom";
import SaveMeForm from "../components/SaveMeForm";
import SaveMeList from "../components/SaveMeList";

const SaveMePage = () => {
  return (
    <Routes>
      <Route path="/" element={<SaveMeList />} />
      <Route path="create" element={<SaveMeForm />} />{" "}
      {/* This matches /saveMes/create */}
      <Route path="edit/:id" element={<SaveMeForm isEditMode={true} />} />{" "}
      {/* This matches /saveMes/edit/:id */}
    </Routes>
  );
};

export default SaveMePage;
