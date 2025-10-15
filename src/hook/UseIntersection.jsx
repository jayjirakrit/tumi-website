import { useEffect, useState } from "react";

export const useIntersection = (elements, rootMargin) => {
  const [isVisible, setState] = useState(false);
  const [visibilities, setVisibilities] = useState([]);

  useEffect(() => {
    const observers = [];

    refs.current.forEach((ref, index) => {
      if (!ref.current) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          setVisibilities((prev) => {
            const newVisibilities = [...prev];
            newVisibilities[index] = entry.isIntersecting;
            return newVisibilities;
          });
        },
        { threshold: 0 }
      );

      observer.observe(ref.current);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [threshold]);

  //   const current = elements?.current;
  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       setState[current](entry.isIntersecting);
  //     },
  //     { rootMargin }
  //   );
  //   current && observer?.observe(current);

  //   // Clean up the observer on unmount
  //   return () => current && observer.unobserve(current);
  // }, []);

  // return isVisible;
};
