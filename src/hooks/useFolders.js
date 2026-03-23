// import { useEffect, useState } from 'react';
// import { supabase } from '@/lib/supabase';

// export function useFolders(user) {
//     const [folders, setFolders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         if (!user) return;

//         const fetchFolders = async () => {
//             setLoading(true);
//             setError(null);

//             try {
//                 const { data, error } = await supabase
                
