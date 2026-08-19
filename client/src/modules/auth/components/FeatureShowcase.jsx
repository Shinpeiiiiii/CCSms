import { motion } from 'framer-motion'
import { CheckCircle2, GraduationCap, Users } from 'lucide-react'

const FeatureShowcase = () => {
  return (
    <section 
      id="features" 
      className="py-24 px-6 sm:px-12 bg-slate-50 border-y border-slate-200/60 overflow-hidden relative"
    >
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* Left Side: Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="text-[#185FA5] font-semibold text-xs uppercase tracking-wider block mb-3 font-sans">
              System Dashboard
            </span>
            <h2 className="text-slate-900 font-sora font-extrabold text-3xl lg:text-4xl leading-[1.25] tracking-tight">
              Empowering Educators. <br />
              <span className="text-slate-500">
                Simplifying Administration.
              </span>
            </h2>
            <p className="text-slate-500 mt-4 max-w-md text-sm lg:text-base leading-relaxed font-sans">
              Access the central workspace for managing student records, academic plans, course allocations, and enrollment applications with clean and intuitive interface design.
            </p>
          </motion.div>
        </div>

        {/* Right Side: Mock Widgets */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative h-[280px] w-full max-w-md">
            {/* Widget 1: Enrollment Approvals */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 bg-white border border-slate-200 p-4 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all duration-300 flex items-center gap-4 w-[260px] sm:w-[280px] cursor-pointer"
            >
              <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-sans mb-0.5">Enrollments</div>
                <div className="text-sm lg:text-base font-extrabold text-slate-900 font-sora">34 Pending Review</div>
                <div className="text-[10px] text-slate-500 mt-1 font-medium font-sans">
                  <span>+8 submitted today</span>
                </div>
              </div>
            </motion.div>

            {/* Widget 2: Active Subject Stats */}
            <motion.div 
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-[90px] right-0 bg-white border border-slate-200 p-4 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all duration-300 flex items-center gap-4 w-[240px] sm:w-[260px] cursor-pointer"
            >
              <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                <GraduationCap size={20} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-sans mb-0.5">Curriculum</div>
                <div className="text-sm lg:text-base font-extrabold text-slate-900 font-sora">8 Active Subjects</div>
                <div className="text-[10px] text-slate-500 mt-1 font-sans">Across 4 departments</div>
              </div>
            </motion.div>

            {/* Widget 3: Total Enrolled Students */}
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-[180px] left-8 bg-white border border-slate-200 p-4 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all duration-300 flex items-center gap-4 w-[260px] sm:w-[280px] cursor-pointer"
            >
              <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                <Users size={20} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-sans mb-0.5">Total Students</div>
                <div className="text-sm lg:text-base font-extrabold text-slate-900 font-sora">120 Enrolled</div>
                <div className="text-[10px] text-slate-500 mt-1 font-medium font-sans">
                  <span>95% average attendance</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeatureShowcase
