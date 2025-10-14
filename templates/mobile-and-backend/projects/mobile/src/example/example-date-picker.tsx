import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import useStateX from "@/hooks/use-state-x";
import Button from "@/components/button";
import { Text } from "react-native";

export default function ExampleDatePicker() {
  const maximumDate = new Date();

  const [date, setDate] = useStateX(maximumDate);
  const [show, setShow] = useStateX(false);

  const handleClick = () => setShow(true);

  const handleChange = (event: DateTimePickerEvent, value?: Date) => {
    if (event.type === "dismissed" || event.type === "set") setShow(false);
    if (value) setDate(value);
  };

  return (
    <>
      <Button type="outline" color="#ffffff20" wrapperClassName="rounded-full" className="px-6 py-2" onClick={handleClick}>
        <Text className="text-lg/7 text-white">Date picker</Text>
      </Button>
      {show.peek && (
        <DateTimePicker
          mode="date"
          design="material"
          value={date.peek}
          title="Date picker"
          maximumDate={maximumDate}
          onChange={handleChange}
          positiveButton={{ label: "Ok" }}
          negativeButton={{ label: "Cancel" }}
        />
      )}
    </>
  );
}
