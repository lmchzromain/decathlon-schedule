import logo from "../assets/decathlon.png";

export default function Title() {
  return (
    <div className="flex items-center gap-3 px-3">
      <img
        src={logo}
        alt="Decathlon"
        className="h-12 w-12 object-contain rounded-[4px]"
      />
      <div>
        <p className="text-xs font-semibold leading-none uppercase tracking-[0.3em]">
          Decathlon Fitness Club
        </p>
        <h1 className="mt-1 text-2xl font-black leading-none">Planning des cours</h1>
      </div>
    </div>
  );
}
