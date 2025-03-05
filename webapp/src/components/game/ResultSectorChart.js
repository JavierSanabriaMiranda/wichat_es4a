import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export const ResultSectorChart = ({ correctAnswers, wrongAnswers, notAnswered }) => {

    const data = [
        { name: "Correctas", value: correctAnswers },
        { name: "Incorrectas", value: wrongAnswers },
        { name: "No Respondidas", value: notAnswered }
    ];
    

    const COLORS = ["#00C49F", "#f13e3e", "#FFBB28"];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={true}
                    outerRadius={85}
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
    );
}