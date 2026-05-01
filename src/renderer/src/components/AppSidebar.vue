<template>
    <aside class="w-56 bg-base-300 flex flex-col h-screen shrink-0">
        <div class="p-4 text-lg font-bold border-b border-base-content/10">
            POS Desktop
        </div>
        <ul class="menu p-2 flex-1">
            <li>
                <RouterLink to="/dashboard" active-class="active">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l9-9 9 9M5 10v9h5v-5h4v5h5v-9"/>
                    </svg>
                    Dashboard
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/produk" active-class="active">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/>
                    </svg>
                    Produk
                </RouterLink>
            </li>
        </ul>
    </aside>
</template>
