import wretch from "wretch";

const api = wretch(import.meta.env.VITE_API_BASE_URL, { mode: "cors" });
// .defer((w) =>  w.auth(`Bearer p.${localStorage.getItem("jwt")}`));

const getAll = () => api.get("all").json();
const getOne = (id) => api.get(`all/${id}`).json();

export { getAll, getOne };
