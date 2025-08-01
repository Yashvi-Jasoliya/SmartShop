import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/app.scss';
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';
import './index.css'
import Footer from './components/Footer.tsx';

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</StrictMode>
);
