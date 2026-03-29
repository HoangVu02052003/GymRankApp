import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null, isAuthenticated: false })
}));

export const useProfileStore = create((set) => ({
  profile: null,
  exp: null,
  streak: null,
  rank: null,
  setProfile: (profile) => set({ profile }),
  setExp: (exp) => set({ exp }),
  setStreak: (streak) => set({ streak }),
  setRank: (rank) => set({ rank }),
  updateProfile: (data) => set((state) => ({ 
    profile: { ...state.profile, ...data } 
  }))
}));

export const useWorkoutStore = create((set) => ({
  todayWorkout: null,
  workoutHistory: [],
  setTodayWorkout: (workout) => set({ todayWorkout: workout }),
  setWorkoutHistory: (history) => set({ workoutHistory: history }),
  completeExercise: (idChiTiet) => set((state) => ({
    todayWorkout: {
      ...state.todayWorkout,
      workouts: state.todayWorkout?.workouts?.map(w => ({
        ...w,
        exercises: w.exercises.map(ex => 
          ex._id === idChiTiet ? { ...ex, trangthai: true } : ex
        )
      }))
    }
  }))
}));

export const useScheduleStore = create((set) => ({
  schedules: [],
  currentSchedule: null,
  setSchedules: (schedules) => set({ schedules }),
  setCurrentSchedule: (schedule) => set({ currentSchedule: schedule }),
  addSchedule: (schedule) => set((state) => ({ 
    schedules: [...state.schedules, schedule] 
  })),
  removeSchedule: (id) => set((state) => ({
    schedules: state.schedules.filter(s => s._id !== id)
  }))
}));

export const useRankStore = create((set) => ({
  allRanks: [],
  currentRank: null,
  canRankUp: false,
  nextRank: null,
  setAllRanks: (ranks) => set({ allRanks: ranks }),
  setCurrentRank: (rank) => set({ currentRank: rank }),
  setRankUpStatus: (canRankUp, nextRank) => set({ canRankUp, nextRank })
}));
