import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Star, BarChart3 } from 'lucide-react';

const Analytics = () => {
    const [topSelling, setTopSelling] = useState([]);
    const [topRevenue, setTopRevenue] = useState([]);

    useEffect(() => {
        const sales = JSON.parse(localStorage.getItem('sales') || '[]');
        const products = JSON.parse(localStorage.getItem('products') || '[]');

        if (sales.length > 0) {
            const productStats = {};

            sales.forEach(sale => {
                sale.products.forEach(p => {
                    const productId = p.productId;
                    if (!productStats[productId]) {
                        const productInfo = products.find(prod => prod.id === productId);
                        productStats[productId] = {
                            name: productInfo?.name || p.productName,
                            code: productInfo?.code || p.productCode,
                            quantity: 0,
                            revenue: 0,
                        };
                    }
                    productStats[productId].quantity += p.quantity;
                    productStats[productId].revenue += p.price * p.quantity;
                });
            });

            const statsArray = Object.values(productStats);

            const sortedBySelling = [...statsArray].sort((a, b) => b.quantity - a.quantity).slice(0, 5);
            setTopSelling(sortedBySelling);

            const sortedByRevenue = [...statsArray].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
            setTopRevenue(sortedByRevenue);
        }
    }, []);

    const StatCard = ({ title, data, dataLabel, dataKey, icon, unit, isCurrency }) => {
        const Icon = icon;
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="glass-effect border-white/20 h-full">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center">
                            <Icon className="h-5 w-5 mr-2" />
                            {title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.length > 0 ? (
                            <ul className="space-y-4">
                                {data.map((item, index) => (
                                    <li key={index} className="flex items-center justify-between border-b border-white/10 pb-2">
                                        <div>
                                            <p className="text-white font-medium">{item.name}</p>
                                            <p className="text-white/70 text-sm">{item.code}</p>
                                        </div>
                                        <p className="text-lg font-bold text-blue-300">
                                            {isCurrency && '₹'}{item[dataKey].toFixed(isCurrency ? 2 : 0)} <span className="text-sm font-normal text-white/70">{unit}</span>
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-white/70 text-center py-8">Not enough data to display.</p>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        );
    };

    return (
        <Layout title="Analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <StatCard
                    title="Top Selling Products (Hero Products)"
                    data={topSelling}
                    dataKey="quantity"
                    unit="units"
                    icon={Star}
                />
                <StatCard
                    title="Top Revenue Products"
                    data={topRevenue}
                    dataKey="revenue"
                    unit=""
                    icon={TrendingUp}
                    isCurrency
                />
            </div>
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-8"
             >
                <Card className="glass-effect border-white/20">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center">
                            <BarChart3 className="h-5 w-5 mr-2" />
                            More Analytics Coming Soon!
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-white/70">
                            This is just the beginning! More advanced analytics, charts, and reports will be available here soon. 
                            You can request specific analytics features in your next prompt!
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </Layout>
    );
};

export default Analytics;