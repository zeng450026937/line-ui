function importAll(map: any, r: any): object {
  r.keys().forEach((key: any) => {
    map[key] = r(key);
  });

  return map;
}

export {
  importAll,
};
