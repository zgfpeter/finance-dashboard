export default function Overview() {
  return (
    <section className="flex flex-col p-3 text-(--text-light) rounded-xl gap-2 w-full ">
      <h1 className="text-4xl">Overview</h1>
      {/* total balance-current net worth across accounts */}
      <p className="text-2xl">Total balance: $ 7532</p>
    </section>
  );
}
