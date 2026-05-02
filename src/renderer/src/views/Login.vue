<template>
    <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div class="card bg-base-100 shadow-xl w-full max-w-sm">
            <div class="card-body gap-5">

                <!-- Header -->
                <div class="text-center">
                    <div class="btn btn-primary btn-square no-animation pointer-events-none mx-auto mb-3">
                        <LayoutGrid class="size-5" />
                    </div>
                    <h1 class="text-xl font-bold">POS Desktop</h1>
                    <p class="text-sm text-base-content/50 mt-1">Masuk ke akun Anda</p>
                </div>

                <!-- Form -->
                <form @submit.prevent="submit" class="space-y-4">
                    <fieldset :disabled="loading" class="space-y-4">

                        <label class="form-control">
                            <span class="label-text mb-1 font-medium">Username</span>
                            <input
                                v-model="form.username"
                                type="text"
                                placeholder="Masukkan username"
                                class="input input-bordered w-full"
                                autocomplete="username"
                                autofocus
                            />
                        </label>

                        <label class="form-control">
                            <span class="label-text mb-1 font-medium">Password</span>
                            <input
                                v-model="form.password"
                                type="password"
                                placeholder="Masukkan password"
                                class="input input-bordered w-full"
                                autocomplete="current-password"
                            />
                        </label>

                        <div v-if="error" class="alert alert-error py-2 text-sm">
                            {{ error }}
                        </div>

                        <button type="submit" class="btn btn-primary w-full" :class="{ loading }">
                            <span v-if="!loading">Masuk</span>
                            <span v-else>Memproses...</span>
                        </button>

                    </fieldset>
                </form>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { LayoutGrid } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'

const router    = useRouter()
const authStore = useAuthStore()

const form    = ref({ username: '', password: '' })
const loading = ref(false)
const error   = ref('')

async function submit() {
    error.value   = ''
    loading.value = true
    try {
        await authStore.login(form.value.username, form.value.password)
        router.push('/dashboard')
    } catch (e) {
        error.value = e.response?.data?.message ?? 'Gagal masuk, coba lagi'
    } finally {
        loading.value = false
    }
}
</script>
