const STORAGE_KEY = "fluxos";

const getAll = async () => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  return data;
};

const add = async (fluxo) => {
  const fluxos = await getAll();
  fluxo.id = new Date().getTime();
  fluxos.push(fluxo);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fluxos));
  return fluxo;
};

const update = async (fluxo) => {
  let fluxos = await getAll();
  fluxos = fluxos.map((f) => (f.id === fluxo.id ? fluxo : f));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fluxos));
  return fluxo;
};

const remove = async (id) => {
  let fluxos = await getAll();
  fluxos = fluxos.filter((f) => f.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fluxos));
  return fluxos;
};

export default {
  getAll,
  add,
  update,
  remove,
};
