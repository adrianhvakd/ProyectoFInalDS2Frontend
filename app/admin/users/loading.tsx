'use client';

export default function Loading() {
  return (
    <div className="min-h-screen bg-base-100 p-6 lg:p-8">
      <main className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="skeleton h-4 w-24 mb-2"></div>
            <div className="skeleton h-8 w-48"></div>
          </div>
          <div className="flex gap-2">
            <div className="skeleton h-8 w-20"></div>
            <div className="skeleton h-8 w-20"></div>
            <div className="skeleton h-8 w-20"></div>
          </div>
        </header>

        <div className="card bg-base-200 border border-base-300">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-base-content/70">Usuario</th>
                    <th className="text-base-content/70">Email</th>
                    <th className="text-base-content/70">Nombre</th>
                    <th className="text-base-content/70">Rol</th>
                    <th className="text-base-content/70">Empresa ID</th>
                    <th className="text-base-content/70">Estado</th>
                    <th className="text-base-content/70">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="hover">
                      <td><div className="skeleton h-4 w-24"></div></td>
                      <td><div className="skeleton h-4 w-32"></div></td>
                      <td><div className="skeleton h-4 w-28"></div></td>
                      <td><div className="skeleton h-4 w-20"></div></td>
                      <td><div className="skeleton h-4 w-12"></div></td>
                      <td><div className="skeleton h-4 w-16"></div></td>
                      <td><div className="skeleton h-8 w-8"></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
