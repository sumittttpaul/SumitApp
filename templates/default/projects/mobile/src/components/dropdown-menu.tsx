import * as Menu from "zeego/dropdown-menu";

type props = {
  items: { icon: string; title: string; onClick?: () => void }[];
} & React.PropsWithChildren;

export default function DropdownMenu({ children, items }: props) {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>{children}</Menu.Trigger>
      <Menu.Content>
        {items.map((data, index) => (
          <Menu.Item key={index.toString()} onSelect={data.onClick}>
            <Menu.ItemTitle>{data.title}</Menu.ItemTitle>
            <Menu.ItemIcon androidIconName={data.icon} />
          </Menu.Item>
        ))}
      </Menu.Content>
    </Menu.Root>
  );
}
