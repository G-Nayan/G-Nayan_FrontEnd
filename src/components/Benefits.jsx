import { benefits } from "../constants";
import Section from "./Section";
import Arrow from "../assets/svg/Arrow";
import ClipPath from "../assets/svg/ClipPath";

const BenefitItem = ({ item }) => (
  <div
    className="relative p-0.5 bg-no-repeat bg-[length:100%_100%] max-w-[24rem] transition-transform hover:scale-105"
    style={{ backgroundImage: `url(${item.backgroundUrl})` }}
  >
    <div className="relative z-2 flex flex-col min-h-[22rem] p-[2.4rem] bg-white rounded-2xl shadow-lg">
      <h5 className="text-xl font-bold mb-5 text-blue-900">{item.title}</h5>
      <p className="text-sm mb-6 text-blue-600">{item.text}</p>
      <div className="flex items-center mt-auto">
        <img
          src={item.iconUrl}
          width={48}
          height={48}
          alt={item.title}
          className="rounded-full shadow-md"
        />
        <p className="ml-auto font-semibold text-xs text-blue-900 uppercase tracking-wider">
          Explore more
        </p>
        <Arrow className="ml-2 text-blue-500" />
      </div>
    </div>

    <div
      className="absolute inset-0.5 bg-gradient-to-br from-blue-50 to-white rounded-2xl"
      style={{ clipPath: "url(#benefits)" }}
    >
      <div className="absolute inset-0 opacity-0 transition-opacity hover:opacity-10">
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            width={380}
            height={362}
            alt={item.title}
            className="w-full h-full object-cover rounded-2xl"
          />
        )}
      </div>
    </div>

    <ClipPath />
  </div>
);

const Benefits = () => {
  return (
    <Section id="efficiency" className="bg-gradient-to-b from-white to-blue-50 py-20">
      <div className="container relative z-2">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 text-blue-900">
          Key Benefits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {benefits.map(item => (
            <BenefitItem item={item} key={item.id} />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Benefits;