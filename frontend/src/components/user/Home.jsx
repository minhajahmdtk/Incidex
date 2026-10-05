import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  UserCheck,
  Clock3,
} from "lucide-react";

import Navbar from "./Navbar";

function Home() {
  const features = [
    {
      icon: FileText,
      title: "Simple Incident Reporting",
      description:
        "Submit a crime incident report through a structured form with the essential case information.",
    },
    {
      icon: MapPin,
      title: "Location Based Reporting",
      description:
        "Identify the incident location using an interactive map and keep location information connected to the case.",
    },
    {
      icon: Clock3,
      title: "Track Case Progress",
      description:
        "Follow your case through clear stages from New and Acknowledged to In Progress and Resolved.",
    },
    {
      icon: BarChart3,
      title: "Case Management",
      description:
        "Administrators can review incidents, monitor case status and manage the reporting workflow.",
    },
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

  return (
    <>
      <Navbar />

      <main>
        {/* Hero */}
        <section
          id="home"
          className="relative overflow-hidden border-b border-slate-200 bg-white"
        >
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8 lg:py-28">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                Secure Crime Incident Reporting
              </div>

              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-[#172033] sm:text-5xl lg:text-6xl">
                Report. Track.
                <span className="block text-blue-600">
                  Resolve.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                INCIDEX provides a structured digital platform for
                reporting crime incidents and tracking case progress
                from submission through resolution.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/register"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#172033] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#25314a]"
                >
                  Report an Incident
                  <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href="#how-it-works"
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Learn How It Works
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Structured reporting
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Case tracking
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Secure access
                </div>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-5">
                <div className="rounded-xl bg-[#172033] p-5 text-white sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Case Overview
                      </p>

                      <p className="mt-1 text-xl font-bold">
                        INC-0024
                      </p>
                    </div>

                    <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300">
                      In Progress
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs text-slate-400">
                            Category
                          </p>

                          <p className="mt-1 font-medium">
                            Theft
                          </p>
                        </div>

                        <FileText className="h-5 w-5 text-slate-400" />
                      </div>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs text-slate-400">
                            Incident Location
                          </p>

                          <p className="mt-1 font-medium">
                            Reported Location
                          </p>
                        </div>

                        <MapPin className="h-5 w-5 text-blue-400" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-slate-400">
                        Case progress
                      </span>

                      <span className="font-medium text-white">
                        75%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-3/4 rounded-full bg-blue-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-slate-200 bg-white p-4 shadow-lg sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                    <UserCheck className="h-5 w-5 text-green-600" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Case tracking
                    </p>

                    <p className="text-sm font-bold text-slate-900">
                      Status updates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="border-b border-slate-200 bg-[#F8FAFC]"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-600">
                How it works
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#172033]">
                A clear reporting process
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
                INCIDEX keeps incident reporting and case tracking
                straightforward with a structured workflow.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <span className="text-sm font-bold text-blue-600">
                    {step.number}
                  </span>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="border-b border-slate-200 bg-white"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-600">
                Platform features
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#172033]">
                Built around the case lifecycle
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                The platform focuses on structured incident reporting,
                case visibility and a clear status workflow.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>

                    <h3 className="mt-5 text-base font-bold text-slate-900">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Trust */}
        <section
          id="trust"
          className="border-b border-slate-200 bg-[#F8FAFC]"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-600">
                  Designed for responsible reporting
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#172033]">
                  Clear information. Clear case status.
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                  INCIDEX separates reporting, case tracking and
                  administrative case management into a structured
                  workflow so users can understand where their case
                  stands.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <LockKeyhole className="h-5 w-5 text-[#172033]" />

                  <h3 className="mt-4 font-bold text-slate-900">
                    Secure access
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Account-based access keeps user and administrator
                    functions separated.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <ShieldCheck className="h-5 w-5 text-[#172033]" />

                  <h3 className="mt-4 font-bold text-slate-900">
                    Structured workflow
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Cases move through clearly defined status stages.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#172033]">
          <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Ready to report an incident?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300">
              Create an account to submit a report and track your case
              through the INCIDEX system.
            </p>

            <div className="mt-7">
              <a
                href="/register"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-[#172033] transition hover:bg-slate-100"
              >
                Create an Account
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#0F172A]">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div>
              <p className="font-bold text-white">
                INCIDEX
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Crime Incident Reporting System
              </p>
            </div>

            <p className="text-xs text-slate-500">
              Report. Track. Resolve.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}

export default Home;