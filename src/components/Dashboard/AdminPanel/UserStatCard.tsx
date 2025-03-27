@@ .. @@
   value: number;
   icon: React.ReactNode;
   highlight?: boolean;
+  isRevenue?: boolean;
 }
 
-function UserStatCard({ title, value, icon, highlight = false }: UserStatCardProps) {
+function UserStatCard({ title, value, icon, highlight = false, isRevenue = false }: UserStatCardProps) {
   return (
     <div className={`
       bg-gradient-to-br from-zinc-900 to-black border border-[#B38B3F]/20 rounded-xl p-4 
@@ .. @@
       <div className="flex items-center justify-between">
         <div>
           <p className="text-white/50 font-medium">{title}</p>
-          <h3 className={`text-2xl font-bold mt-1 ${highlight ? 'text-[#FFD700]' : 'text-white'}`}>{value}</h3>
+          <h3 className={`text-2xl font-bold mt-1 ${highlight ? 'text-[#FFD700]' : 'text-white'}`}>
+            {isRevenue ? `$${value.toLocaleString()}` : value.toLocaleString()}
+          </h3>
         </div>
         <div className={`
           w-10 h-10 rounded-xl flex items-center justify-center border border-[#B38B3F]/20