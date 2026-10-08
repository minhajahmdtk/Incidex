import { useEffect, useRef } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  MapPin,
  ShieldCheck,
  UserCheck,
  Clock3,
} from "lucide-react";
import gsap from "gsap";

import Navbar from "./Navbar";

function Home() {
  const marqueeRef = useRef(null);
  const marqueeAnimationRef = useRef(null);

  const features = [
    {
      icon: FileText,
      title: "Simple Incident Reporting",

    },
    {
      icon: MapPin,
      title: "Location Based Reporting",
    },
    {
      icon: Clock3,
      title: "Track Case Progress",

    },
    {
      icon: BarChart3,
      title: "Case Management",
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Create an account",
      description:
        "Register with your basic information and securely access the reporting system.",
    },
    {
      number: "02",
      title: "Report an incident",
      description:
        "Provide the incident category, description and location through the reporting form.",
    },
    {
      number: "03",
      title: "Track your case",
      description:
        "View your case information, status history and resolution details from your dashboard.",
    },
  ];

  useEffect(() => {
    const marquee = marqueeRef.current;

    if (!marquee) {
      return undefined;
    }

    const animation = gsap.to(marquee, {
      xPercent: -50,
      duration: 24,
      ease: "none",
      repeat: -1,
    });

    marqueeAnimationRef.current = animation;

    const handleMouseEnter = () => {
      animation.pause();
    };

    const handleMouseLeave = () => {
      animation.resume();
    };

    marquee.addEventListener("mouseenter", handleMouseEnter);
    marquee.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      marquee.removeEventListener("mouseenter", handleMouseEnter);
      marquee.removeEventListener("mouseleave", handleMouseLeave);

      animation.kill();
      marqueeAnimationRef.current = null;
    };
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* ============================================================
              HERO / HOME
          ============================================================ */}

        <section
          id="home"
          className="
              relative
              min-h-[calc(100vh-72px)]
              overflow-hidden
              bg-gradient-to-br
              from-[#F2F3F4]
              via-[#F1E8E8]
              to-[#E5F0E7]
              transition-colors
              duration-300
              dark:from-[#151A21]
              dark:via-[#211C20]
              dark:to-[#18251C]
            "
        >
          {/* Background decoration */}

          <div
            className="
                pointer-events-none
                absolute
                -right-24
                -top-24
                h-96
                w-96
                rounded-full
                bg-[#B94A48]/10
                blur-3xl
                dark:bg-[#D76562]/10
              "
          />

          <div
            className="
                pointer-events-none
                absolute
                -bottom-40
                -left-32
                h-96
                w-96
                rounded-full
                bg-[#7FAF8A]/15
                blur-3xl
                dark:bg-[#91BD9C]/10
              "
          />

          {/* Hero Container */}

          <div
            className="
                relative
                mx-auto
                flex
                min-h-[calc(100vh-72px)]
                w-full
                max-w-7xl
                items-center
                px-4
                py-16
                sm:px-6
                sm:py-20
                lg:px-8
                lg:py-16
              "
          >
            <div
              className="
                  grid
                  w-full
                  items-center
                  gap-14
                  lg:grid-cols-[1.08fr_0.92fr]
                  lg:gap-16
                "
            >
              {/* ======================================================
                    HERO CONTENT
                ====================================================== */}

              <div>
                {/* Badge */}

                <div
                  className="
                      mb-6
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-border
                      bg-card
                      px-3.5
                      py-1.5
                      text-xs
                      font-semibold
                      text-card-foreground
                      shadow-sm
                    "
                >
                  <ShieldCheck
                    className="
                        h-3.5
                        w-3.5
                        text-[#B94A48]
                        dark:text-[#D76562]
                      "
                  />

                  <span>Secure Crime Incident Reporting</span>
                </div>

                {/* Main Heading */}

                <h1
                  className="
                      max-w-4xl
                      text-5xl
                      font-bold
                      leading-[1.05]
                      tracking-tight
                      sm:text-6xl
                      lg:text-7xl
                    "
                >
                  {/* REPORT = RED */}

                  <span
                    className="
                        block
                        text-[#B94A48]
                        dark:text-[#D76562]
                      "
                  >
                    Report.
                  </span>

                  {/* TRACK + RESOLVE = RED TO GREEN */}

                  <span
                    className="
                        block
                        bg-gradient-to-r
                        from-[#B94A48]
                        via-[#7FAF8A]
                        to-[#5F9F6B]
                        bg-clip-text
                        text-transparent
                        dark:from-[#D76562]
                        dark:via-[#91BD9C]
                        dark:to-[#7FBF8B]
                      "
                  >
                    Track. Resolve.
                  </span>
                </h1>

                {/* Description */}

                <p
                  className="
                      mt-7
                      max-w-2xl
                      text-base
                      leading-7
                      text-muted-foreground
                      sm:text-lg
                      sm:leading-8
                    "
                >
                  INCIDEX provides a structured digital platform for reporting
                  crime incidents and tracking case progress from submission
                  through resolution.
                </p>

                {/* CTA Buttons */}

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  {/* Primary */}

                  <a
                    href="/register"
                    className="
                        group
                        inline-flex
                        h-12
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-[#343A40]
                        px-7
                        text-sm
                        font-semibold
                        text-white
                        shadow-md
                        transition-all
                        duration-200
                        hover:-translate-y-0.5
                        hover:bg-[#4A5157]
                        hover:shadow-lg
                        dark:bg-[#C4C8CC]
                        dark:text-[#151A21]
                        dark:hover:bg-[#D5D8DA]
                      "
                  >
                    <span>Report an Incident</span>

                    <ArrowRight
                      className="
                          h-4
                          w-4
                          transition-transform
                          duration-200
                          group-hover:translate-x-1
                        "
                    />
                  </a>

                  {/* Secondary */}

                  <a
                    href="#how-it-works"
                    className="
                        inline-flex
                        h-12
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-border
                        bg-card
                        px-7
                        text-sm
                        font-semibold
                        text-card-foreground
                        transition-all
                        duration-200
                        hover:-translate-y-0.5
                        hover:border-[#7FAF8A]
                        hover:bg-[#E1E4E6]
                        dark:hover:border-[#91BD9C]
                        dark:hover:bg-[#303842]
                      "
                  >
                    Learn How It Works
                  </a>
                </div>

                {/* Highlights */}

                <div
                  className="
                      mt-9
                      flex
                      flex-wrap
                      gap-x-7
                      gap-y-3
                      text-sm
                      text-muted-foreground
                    "
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className="
                          h-4
                          w-4
                          text-[#B94A48]
                          dark:text-[#D76562]
                        "
                    />

                    <span>Structured reporting</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className="
                          h-4
                          w-4
                          text-[#7FAF8A]
                          dark:text-[#91BD9C]
                        "
                    />

                    <span>Case tracking</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className="
                          h-4
                          w-4
                          text-[#5F9F6B]
                          dark:text-[#7FBF8B]
                        "
                    />

                    <span>Secure access</span>
                  </div>
                </div>
              </div>

              {/* ======================================================
                    HERO CASE PREVIEW
                ====================================================== */}

              <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
                {/* Main card */}

                <div
                  className="
                      rounded-3xl
                      border
                      border-border
                      bg-card
                      p-3
                      shadow-xl
                      shadow-foreground/5
                      dark:shadow-black/20
                      sm:p-4
                    "
                >
                  <div
                    className="
                        rounded-2xl
                        border
                        border-border
                        bg-secondary
                        p-5
                        shadow-sm
                        sm:p-6
                      "
                  >
                    {/* Header */}

                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Case Overview
                        </p>

                        <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                          INC-0024
                        </p>
                      </div>

                      <span
                        className="
                            rounded-full
                            border
                            border-[#7FAF8A]/40
                            bg-[#7FAF8A]/10
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            text-[#4F8059]
                            dark:border-[#91BD9C]/40
                            dark:bg-[#91BD9C]/10
                            dark:text-[#91BD9C]
                          "
                      >
                        In Progress
                      </span>
                    </div>

                    {/* Details */}

                    <div className="mt-6 space-y-3">
                      {/* Category */}

                      <div
                        className="
                            rounded-xl
                            border
                            border-border
                            bg-card
                            p-4
                            shadow-sm
                          "
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Category
                            </p>

                            <p className="mt-1 font-semibold text-card-foreground">
                              Theft
                            </p>
                          </div>

                          <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-[#B94A48]/10
                                dark:bg-[#D76562]/10
                              "
                          >
                            <FileText
                              className="
                                  h-5
                                  w-5
                                  text-[#B94A48]
                                  dark:text-[#D76562]
                                "
                            />
                          </div>
                        </div>
                      </div>

                      {/* Location */}

                      <div
                        className="
                            rounded-xl
                            border
                            border-border
                            bg-card
                            p-4
                            shadow-sm
                          "
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Incident Location
                            </p>

                            <p className="mt-1 font-semibold text-card-foreground">
                              Reported Location
                            </p>
                          </div>

                          <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-[#7FAF8A]/10
                                dark:bg-[#91BD9C]/10
                              "
                          >
                            <MapPin
                              className="
                                  h-5
                                  w-5
                                  text-[#5F9F6B]
                                  dark:text-[#7FBF8B]
                                "
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}

                    <div className="mt-6">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Case progress
                        </span>

                        <span className="text-xs font-semibold text-foreground">
                          75%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-border">
                        <div
                          className="
                              h-full
                              w-3/4
                              rounded-full
                              bg-gradient-to-r
                              from-[#B94A48]
                              via-[#7FAF8A]
                              to-[#5F9F6B]
                              dark:from-[#D76562]
                              dark:via-[#91BD9C]
                              dark:to-[#7FBF8B]
                            "
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating status card */}

                <div
                  className="
                      absolute
                      -bottom-6
                      -left-6
                      hidden
                      rounded-2xl
                      border
                      border-border
                      bg-card
                      p-4
                      shadow-lg
                      shadow-foreground/5
                      dark:shadow-black/20
                      sm:block
                    "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          bg-[#7FAF8A]/10
                          dark:bg-[#91BD9C]/10
                        "
                    >
                      <UserCheck
                        className="
                            h-5
                            w-5
                            text-[#5F9F6B]
                            dark:text-[#7FBF8B]
                          "
                      />
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Case tracking
                      </p>

                      <p className="text-sm font-bold text-card-foreground">
                        Status updates
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
              HOW IT WORKS
          ============================================================ */}

        <section
          id="how-it-works"
          className="
              bg-background
              transition-colors
              duration-300
            "
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p
                className="
                    text-sm
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-[#B94A48]
                    dark:text-[#D76562]
                  "
              >
                How it works
              </p>

              <h2
                className="
                    mt-2
                    text-3xl
                    font-bold
                    tracking-tight
                    text-foreground
                    sm:text-4xl
                  "
              >
                A clear reporting process
              </h2>

              <p
                className="
                    mt-4
                    text-sm
                    leading-6
                    text-muted-foreground
                    sm:text-base
                  "
              >
                INCIDEX keeps incident reporting and case tracking
                straightforward with a structured workflow.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="
                      group
                      rounded-2xl
                      bg-card
                      p-6
                      shadow-sm
                      transition-all
                      duration-200
                      hover:-translate-y-1
                      hover:shadow-md
                    "
                >
                  <span
                    className={`
                        inline-flex
                        h-8
                        min-w-8
                        items-center
                        justify-center
                        rounded-lg
                        px-2
                        text-sm
                        font-bold
                        ${index === 0
                        ? "bg-[#B94A48]/10 text-[#B94A48] dark:bg-[#D76562]/10 dark:text-[#D76562]"
                        : index === 1
                          ? "bg-[#7FAF8A]/10 text-[#5F805F] dark:bg-[#91BD9C]/10 dark:text-[#91BD9C]"
                          : "bg-[#5F9F6B]/10 text-[#4F8059] dark:bg-[#7FBF8B]/10 dark:text-[#7FBF8B]"
                      }
                      `}
                  >
                    {step.number}
                  </span>

                  <h3 className="mt-5 text-lg font-bold text-card-foreground">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
              FEATURES
          ============================================================ */}

        <section
          id="features"
          className="
              overflow-hidden
              bg-background
              transition-colors
              duration-300
            "
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            {/* Section Heading */}

            <div className="text-center">
              <p
                className="
                    text-sm
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-[#B94A48]
                    dark:text-[#D76562]
                  "
              >
                Platform features
              </p>

              <h2
                className="
                    mt-2
                    text-3xl
                    font-bold
                    tracking-tight
                    text-foreground
                    sm:text-4xl
                  "
              >
                Built around the case lifecycle
              </h2>

              <p
                className="
                    mx-auto
                    mt-4
                    max-w-2xl
                    text-sm
                    leading-6
                    text-muted-foreground
                    sm:text-base
                  "
              >
                The platform focuses on structured incident reporting, case
                visibility and a clear status workflow.
              </p>
            </div>

            {/* ========================================================
                  GSAP MARQUEE
              ======================================================== */}

            <div className="relative mt-12 overflow-hidden">
              {/* Marquee Track */}

              <div
                ref={marqueeRef}
                className="
                    flex
                    w-max
                    items-stretch
                    gap-5
                    will-change-transform
                  "
              >
                {/* First set */}

                {features.map((feature, index) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={`first-${feature.title}`}
                      className="
                          group
                          relative
                          w-[280px]
                          shrink-0
                          rounded-2xl
                          border
                          border-border
                          bg-card
                          p-6
                          shadow-sm
                          transition-all
                          duration-300
                          hover:-translate-y-1
                          hover:shadow-md
                          sm:w-[320px]
                        "
                    >
                      {/* Icon */}

                      <div
                        className={`
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            transition-colors
                            duration-300
                            ${index === 0
                            ? "bg-[#B94A48]/10 group-hover:bg-[#B94A48]/15 dark:bg-[#D76562]/10 dark:group-hover:bg-[#D76562]/15"
                            : index === 1
                              ? "bg-[#7FAF8A]/10 group-hover:bg-[#7FAF8A]/15 dark:bg-[#91BD9C]/10 dark:group-hover:bg-[#91BD9C]/15"
                              : "bg-[#5F9F6B]/10 group-hover:bg-[#5F9F6B]/15 dark:bg-[#7FBF8B]/10 dark:group-hover:bg-[#7FBF8B]/15"
                          }
                          `}
                      >
                        <Icon
                          className={`
                              h-5
                              w-5
                              ${index === 0
                              ? "text-[#B94A48] dark:text-[#D76562]"
                              : index === 1
                                ? "text-[#5F805F] dark:text-[#91BD9C]"
                                : "text-[#4F8059] dark:text-[#7FBF8B]"
                            }
                            `}
                        />
                      </div>

                      {/* Title */}

                      <h3 className="mt-5 text-base font-bold text-card-foreground">
                        {feature.title}
                      </h3>

                      {/* Description */}

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {feature.description}
                      </p>

                      {/* Bottom Accent */}

                      <div
                        className={`
                            mt-6
                            h-1
                            w-12
                            rounded-full
                            ${index === 0
                            ? "bg-[#B94A48]"
                            : index === 1
                              ? "bg-[#7FAF8A]"
                              : "bg-[#5F9F6B]"
                          }
                          `}
                      />
                    </div>
                  );
                })}

                {/* Second set for seamless loop */}

                {features.map((feature, index) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={`second-${feature.title}`}
                      className="
                          group
                          relative
                          w-[280px]
                          shrink-0
                          rounded-2xl
                          border
                          border-border
                          bg-card
                          p-6
                          shadow-sm
                          transition-all
                          duration-300
                          hover:-translate-y-1
                          hover:shadow-md
                          sm:w-[320px]
                        "
                    >
                      {/* Icon */}

                      <div
                        className={`
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            transition-colors
                            duration-300
                            ${index === 0
                            ? "bg-[#B94A48]/10 group-hover:bg-[#B94A48]/15 dark:bg-[#D76562]/10 dark:group-hover:bg-[#D76562]/15"
                            : index === 1
                              ? "bg-[#7FAF8A]/10 group-hover:bg-[#7FAF8A]/15 dark:bg-[#91BD9C]/10 dark:group-hover:bg-[#91BD9C]/15"
                              : "bg-[#5F9F6B]/10 group-hover:bg-[#5F9F6B]/15 dark:bg-[#7FBF8B]/10 dark:group-hover:bg-[#7FBF8B]/15"
                          }
                          `}
                      >
                        <Icon
                          className={`
                              h-5
                              w-5
                              ${index === 0
                              ? "text-[#B94A48] dark:text-[#D76562]"
                              : index === 1
                                ? "text-[#5F805F] dark:text-[#91BD9C]"
                                : "text-[#4F8059] dark:text-[#7FBF8B]"
                            }
                            `}
                        />
                      </div>

                      {/* Title */}

                      <h3 className="mt-5 text-base font-bold text-card-foreground">
                        {feature.title}
                      </h3>

                      {/* Description */}

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {feature.description}
                      </p>

                      {/* Bottom Accent */}

                      <div
                        className={`
                            mt-6
                            h-1
                            w-12
                            rounded-full
                            ${index === 0
                            ? "bg-[#B94A48]"
                            : index === 1
                              ? "bg-[#7FAF8A]"
                              : "bg-[#5F9F6B]"
                          }
                          `}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Left Fade */}

              <div
                className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    left-0
                    z-10
                    w-16
                    bg-gradient-to-r
                    from-background
                    to-transparent
                    sm:w-24
                  "
              />

              {/* Right Fade */}

              <div
                className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    right-0
                    z-10
                    w-16
                    bg-gradient-to-l
                    from-background
                    to-transparent
                    sm:w-24
                  "
              />
            </div>
          </div>
        </section>

        {/* ============================================================
              FOOTER
          ============================================================ */}

        <footer
          className="
              border-t
              border-border
              bg-primary
              text-primary-foreground
            "
        >
          <div
            className="
                mx-auto
                flex
                max-w-7xl
                flex-col
                gap-4
                px-4
                py-8
                sm:px-6
                md:flex-row
                md:items-center
                md:justify-between
                lg:px-8
              "
          >
            <div>
              <p className="font-bold">INCIDEX</p>

              <p className="mt-1 text-xs opacity-60">
                Crime Incident Reporting System
              </p>
            </div>

            <p className="text-xs opacity-50">
              © 2026 INCIDEX. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}

export default Home;

