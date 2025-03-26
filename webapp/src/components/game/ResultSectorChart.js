import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

/**
 * React component that represents a pie chart with the results of a game.
 * 
 * @param {Int} correctAnswers represents the number of correct answers.
 * @param {Int} wrongAnswers represents the number of wrong answers.
 * @param {Int} notAnswered represents the number of not answered questions. 
 * @returns the pie chart with the results of the game.
 */
export const ResultSectorChart = ({ correctAnswers, wrongAnswers, notAnswered }) => {

    /**
     * Constant that represents the data of the pie chart.
     */
    const data = [
        { name: "Correctas", value: correctAnswers },
        { name: "Incorrectas", value: wrongAnswers },
        { name: "No Respondidas", value: notAnswered }
    ];

    const COLORS = ["#00C49F", "#f13e3e", "#f7ab08"];

    /**
     * Function to render the number of every data inside the pie chart in white.
     */
    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
        const RADIAN = Math.PI / 180;
        const x = cx + (innerRadius + (outerRadius - innerRadius) / 2) * Math.cos(-midAngle * RADIAN);
        const y = cy + (innerRadius + (outerRadius - innerRadius) / 2) * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={16} fontWeight="bold">
                {value != 0 ? value : ""}
            </text>
        );
    };

    return (
        <div className="pie-chart-container">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {
                            data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))
                        }
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}