import { Routes, Route } from 'react-router-dom';
import { Homepage, Register, Login, Lost } from '~/views';

export default function App() {
  return (
    <Routes>
      <Route index element={<Homepage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='*' element={<Lost />} />
    </Routes>
  );
}
