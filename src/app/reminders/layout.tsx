import Header from "@/components/reminder/header";

const ReminderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default ReminderLayout;
