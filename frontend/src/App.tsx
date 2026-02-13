import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { PaymentScreen } from "./screens/PaymentScreen";
import { TestData } from "./screens/TestData";
import { InvoiceList } from "./screens/InvoiceList"; // Import the new screen

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
                <nav className="bg-white border-b px-6 py-4 flex gap-6 shadow-sm sticky top-0 z-10">
                    <Link to="/" className="font-bold text-xl text-blue-600">FinanceApp</Link>
                    <div className="flex gap-4 items-center text-sm font-medium text-gray-600">
                        <ul>
                            <li><Link to="/" className="hover:text-blue-600 transition">All Invoices</Link></li>
                            <li><Link to="/test-data" className="hover:text-blue-600 transition">Generator</Link></li>
                        </ul>
                    </div>
                </nav>

                <Routes>
                    <Route path="/test-data" element={<TestData />} />
                    <Route path="/payment/:id" element={<PaymentScreen />} />
                    {/* Use the List as the default route */}
                    <Route path="/" element={<InvoiceList />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
