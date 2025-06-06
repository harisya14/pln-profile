"use client";

import React, { useEffect, useRef, useState } from "react";

const teamMembers = [
  {
    name: "Bonnie Green",
    role: "CEO/Co-founder",
    image: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png",
    socials: {
      facebook: "#",
      twitter: "#",
      github: "#",
      dribbble: "#",
    },
  },
  {
    name: "Helene Engels",
    role: "CTO/Co-founder",
    image: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/helene-engels.png",
    socials: {
      facebook: "#",
      twitter: "#",
      github: "#",
      dribbble: "#",
    },
  },
  {
    name: "Jese Leos",
    role: "SEO & Marketing",
    image: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png",
    socials: {
      facebook: "#",
      twitter: "#",
      github: "#",
      dribbble: "#",
    },
  },
  {
    name: "Lana Byrd",
    role: "Web Designer",
    image: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/sofia-mcguire.png",
    socials: {
      facebook: "#",
      twitter: "#",
      github: "#",
      dribbble: "#",
    },
  },
];

const TeamSection: React.FC = () => {
  const titleBlockRef = useRef<HTMLDivElement | null>(null);
  const membersRef = useRef<HTMLDivElement | null>(null);

  const [titleInView, setTitleInView] = useState(false);
  const [membersInView, setMembersInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setTitleInView(entry.isIntersecting),
      { threshold: 0.7 }
    );
    const current = titleBlockRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setMembersInView(entry.isIntersecting),
      { threshold: 0.4 }
    );
    const current = membersRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-6">
        <div
          ref={titleBlockRef}
          className={`mx-auto mb-8 max-w-screen-sm lg:mb-16 transform transition duration-1000 ease-in-out ${
            titleInView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-8 scale-90"
          }`}
        >
          <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-primary dark:text-white">
            Our Team
          </h2>
          <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
            Jelajahi profil lengkap para pemimpin unggulan kami dalam menghadirkan energi untuk negeri
          </p>
        </div>

        <div
          ref={membersRef}
          className="grid gap-8 lg:gap-16 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4"
        >
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className={`text-center text-gray-500 dark:text-gray-400 transform transition-all duration-700 ease-in-out ${
                membersInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="transition-transform duration-300 hover:scale-110">
                <img
                  className="mx-auto mb-4 w-36 h-36 rounded-full"
                  src={member.image}
                  alt={`${member.name} Avatar`}
                />
                <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  <a href="#">{member.name}</a>
                </h3>
                <p>{member.role}</p>
                <ul className="flex justify-center mt-4 space-x-4">
                  <li>
                    <a href={member.socials.facebook} className="text-[#39569c] hover:text-gray-900 dark:hover:text-white">
                      <i className="fab fa-facebook-f" />
                    </a>
                  </li>
                  <li>
                    <a href={member.socials.twitter} className="text-[#00acee] hover:text-gray-900 dark:hover:text-white">
                      <i className="fab fa-twitter" />
                    </a>
                  </li>
                  <li>
                    <a href={member.socials.github} className="text-gray-900 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                      <i className="fab fa-github" />
                    </a>
                  </li>
                  <li>
                    <a href={member.socials.dribbble} className="text-[#ea4c89] hover:text-gray-900 dark:hover:text-white">
                      <i className="fab fa-dribbble" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
