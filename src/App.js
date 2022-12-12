/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Card, FlexLayout, Select, Toast, ToastWrapper } from "@cedcommerce/ounce-ui";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [isLastReached, setIsLastReached] = useState(false);

  useEffect(() => {
    let temp = [];
    fetch("./Data.txt")
      .then((response) => response.text())
      .then((result) => {
        result.split("\n").map((item) => temp.push(item.split(" > ")));
        setData(temp);
      });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;
    let temp = [];
    let tempOptions = [];
    data.map(
      (item) =>
        selected[options.length - 1] === item[options.length - 1] &&
        item[options.length] && temp.push(item[options.length])
    );
    let unique = temp.filter(getUniqueElements);
    unique.map((item) => tempOptions.push({ label: item, value: item }));
    tempOptions.length > 0
      ? setOptions([...options, tempOptions])
      : setIsLastReached(!isLastReached);
  }, [data, selected]);

  // Function to Get array of Unique Elements
  const getUniqueElements = (value, index, self) => {
    return self.indexOf(value) === index;
  };

  // Function to handle changes in select field
  const handleSelectChange = (label, object, pos) => {
    let tempSelected = [...selected];
    let tempOptions = [...options];
    tempSelected[pos] = label;
    if (options.length - 1 > pos) {
      tempOptions.splice(pos + 1);
      tempSelected.splice(pos + 1);
    }
    setOptions(tempOptions);
    setSelected(tempSelected);
  };

  return (
    <div className="App">
      <Card title="Google Taxonomy">
        <FlexLayout childWidth="fullWidth" direction="vertical" spacing="tight">
          {options.map((item, index) => (
            <Select
              onChange={(label, object) => {
                handleSelectChange(label, object, index);
              }}
              key={item}
              options={options[index]}
              placeholder="Select"
              popoverContainer="body"
              thickness="thick"
              value={selected[index]}
            />
          ))}
        </FlexLayout>
        {isLastReached && (
          <ToastWrapper>
            <Toast
              message="Last Child reached !!"
              onDismiss={() => {
                setIsLastReached(!isLastReached);
              }}
              timeout={1500}
              type="error"
            />
          </ToastWrapper>
        )}
      </Card>
    </div>
  );
}
export default App;