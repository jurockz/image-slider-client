const saveHierarchyData = async (hierarchyData) => {
  const parsedHierarchyData = JSON.stringify(hierarchyData)
  // console.log(parsedHierarchyData);
  fetch("/api/hierarchy/save", {
    method: "POST",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: parsedHierarchyData
  })
    .then((res) => res.json())
    .then((data) => {});
};

export {
  saveHierarchyData
}