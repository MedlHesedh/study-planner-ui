'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, BookOpen, Zap, Calendar, BarChart3, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        router.push(ROUTES.DASHBOARD)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-border/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">StudyFlow</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/auth/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold leading-tight text-balance">
                Master Your Learning with Intelligent Study Planning
              </h2>
              <p className="text-xl text-muted-foreground text-balance">
                StudyFlow automatically distributes your study modules across days, adapts to your schedule, and keeps you focused on what matters.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/sign-up">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Login
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
              <Zap className="w-8 h-8 text-blue-500 mb-3" />
              <h3 className="font-semibold mb-2">Smart Distribution</h3>
              <p className="text-sm text-muted-foreground">
                Auto-distribute modules based on study hours
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
              <Calendar className="w-8 h-8 text-green-500 mb-3" />
              <h3 className="font-semibold mb-2">Calendar View</h3>
              <p className="text-sm text-muted-foreground">
                Visualize your study schedule at a glance
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
              <BarChart3 className="w-8 h-8 text-amber-500 mb-3" />
              <h3 className="font-semibold mb-2">Progress Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your completion and study streaks
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
              <BookOpen className="w-8 h-8 text-purple-500 mb-3" />
              <h3 className="font-semibold mb-2">Focus Mode</h3>
              <p className="text-sm text-muted-foreground">
                Pomodoro timer to maintain productivity
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-8 py-16 border-t border-border/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose StudyFlow?</h2>
          <p className="text-lg text-muted-foreground text-balance">
            Everything you need to study smarter, not harder
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Personalized Plans',
              description: 'Adapt the study planner to your pace and schedule preferences',
            },
            {
              title: 'Stay Organized',
              description: 'Keep track of all your modules, subjects, and progress in one place',
            },
            {
              title: 'Boost Productivity',
              description: 'Built-in Pomodoro timer and focus mode to maximize study sessions',
            },
          ].map((benefit) => (
            <div key={benefit.title} className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-8 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Study Routine?</h2>
          <p className="text-lg text-muted-foreground mb-8 text-balance">
            Start planning your studies smarter today with StudyFlow
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg">
              Get Started Now <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-8 text-center text-muted-foreground">
          <p>© 2024 StudyFlow. Build your perfect study schedule.</p>
        </div>
      </footer>
    </div>
  )
}
