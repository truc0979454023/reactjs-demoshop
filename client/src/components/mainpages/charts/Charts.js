import React, { useEffect, useState, useContext } from 'react'
import { GlobalState } from '../../../GlobalState';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import print from 'print-js'


function Charts() {
    const state = useContext(GlobalState)
    const [history] = state.userAPI.history

    const [monthHistorys, setMonthHistorys] = useState([])

    const [date] = useState(new Date());
    const [year, setYear] = useState(date.getFullYear());
    const [month, setMonth] = useState(0);

    const [sumProductSold, setSumProductSold] = useState([])
    const [listYear, setListYear] = useState([])

    const [sumQuantity, setQuantity] = useState(0)
    const [sumPrice, setSumPrice] = useState(0)

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    useEffect(() => {
        const temp01 = months.map((month, index) => {
            return history.reduce((array, item) => {
                if (new Date(item.createdAt).getMonth() === index) {

                    const totalSale = item.cart.reduce((sum, item) => (
                        sum += item.product.price * item.product.quantity
                    ), 0)

                    const totalSold = item.cart.reduce((sum, item) => (
                        sum += item.product.quantity
                    ), 0)

                    array.push({
                        totalSale: totalSale,
                        totalSold: totalSold,
                        year: new Date(item.createdAt).getFullYear()
                    })
                }
                return array
            }, [])
        })


        const temp02 = temp01.map((item, index) => {
            return item.reduce((sum, i) => {
                if (i.year === year) {
                    sum.sale += i.totalSale
                    sum.sold += i.totalSold
                }
                return sum
            }, { month: months[index], sale: 0, sold: 0 })
        })

        setMonthHistorys(temp02)
    }, [history, year])

    useEffect(() => {
        const temp01 = history.reduce((array, hs) => {
            if (new Date(hs.createdAt).getFullYear() === year) {
                const temp02 = hs.cart.reduce((array, item) => {

                    array.push({ ...item.product, monthCreated: new Date(hs.createdAt).getMonth() + 1 })
                    return array
                }, [])
                array.push(temp02)
            }
            return array
        }, [])
        const temp03 = temp01.reduce((array, item) => {
            array.push(...item)
            return array
        }, [])

        function groupBy(list, keyGetter) {
            const map = new Map();
            list.forEach((item) => {
                const key = keyGetter(item);
                const collection = map.get(key);
                if (!collection) {
                    map.set(key, [item]);
                } else {
                    collection.push(item);
                }
            });
            return map;
        }
        const groupedById = groupBy(temp03, item => item._id);

        let values = Array.from(groupedById.values());

        const temp04 = values.map(products => {
            return products.reduce((objProduct, product) => {

                if (month === 0) {
                    objProduct.sumQuantity += product.quantity
                    objProduct.sumPrice += product.quantity * product.price
                    objProduct._id = product._id
                    objProduct.title = product.title
                    objProduct.img = product.images[0]
                }
                else if (product.monthCreated === month) {
                    objProduct.sumQuantity += product.quantity
                    objProduct.sumPrice += product.quantity * product.price
                    objProduct._id = product._id
                    objProduct.title = product.title
                    objProduct.img = product.images[0]
                }

                return objProduct
            }, { _id: '', title: '', img: '', sumQuantity: 0, sumPrice: 0 })
        })
        setSumProductSold(temp04.filter(item => item._id !== ''))
    }, [history, year, month])

    useEffect(() => {
        function Count() {
            const arrayYear = []
            for (let i = date.getFullYear(); i >= 2000; i--) {
                arrayYear.push(<option key={i} value={i}>{i}</option>)
            }
            setListYear(arrayYear)
        }
        Count()
    }, [date.getFullYear()])

    useEffect(() => {
        const getTotal = async () => {

            if (sumProductSold) {
                const sumQuantity = await sumProductSold.reduce((prev, item) => {
                    return prev + item.sumQuantity
                }, 0)
                setQuantity(sumQuantity)

                const sumPrice = await sumProductSold.reduce((prev, item) => {
                    return prev + item.sumPrice
                }, 0)
                setSumPrice(sumPrice)
            }
        }

        getTotal()
    }, [sumProductSold])

    function exportTableToExcel(tableID, filename = '') {

        let downloadLink
        const dataType = 'application/vnd.ms-excel';
        const tableSelect = document.getElementById(tableID);
        const tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');


        // Specify file name
        filename = filename ? filename + '.xls' : 'excel_data.xls';

        // Create download link element
        downloadLink = document.createElement("a");


        if (navigator.msSaveOrOpenBlob) {
            const blob = new Blob(['\ufeff', tableHTML], {
                type: dataType
            });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            // Create a link to the file
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

            // Setting the file name
            downloadLink.download = filename;

            //triggering the function
            downloadLink.click();
        }
    }
    const myExcelXML = (function () {
        let Workbook, WorkbookStart = '<?xml version="1.0"?><ss:Workbook  xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40">';
        const WorkbookEnd = '</ss:Workbook>';
        let fs, SheetName = 'SHEET 1',
            styleID = 1, columnWidth = 80,
            fileName = "Employee_List", uri, link;

        class myExcelXML {
            constructor(respArray) {

                let finalDataArray = [];

                for (let i = 0; i < respArray.length; i++) {
                    finalDataArray.push(flatten(respArray[i]));
                }

                let s = JSON.stringify(finalDataArray);
                fs = s.replace(/&/gi, '&amp;');
            }

            downLoad() {
                const Worksheet = myXMLWorkSheet(SheetName, fs);

                WorkbookStart += myXMLStyles(styleID);

                Workbook = WorkbookStart + Worksheet + WorkbookEnd;

                uri = 'data:text/xls;charset=utf-8,' + encodeURIComponent(Workbook);
                link = document.createElement("a");
                link.href = uri;
                link.style = "visibility:hidden";
                link.download = fileName + ".xls";

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            get fileName() {
                return fileName;
            }

            set fileName(n) {
                fileName = n;
            }

            get SheetName() {
                return SheetName;
            }

            set SheetName(n) {
                SheetName = n;
            }

            get styleID() {
                return styleID;
            }

            set styleID(n) {
                styleID = n;
            }
        }

        const myXMLStyles = function (id) {
            let Styles = '<ss:Styles><ss:Style ss:ID="' + id + '"><ss:Font ss:Bold="1"/></ss:Style></ss:Styles>';

            return Styles;
        }

        const myXMLWorkSheet = function (name, o) {
            const Table = myXMLTable(o);
            let WorksheetStart = '<ss:Worksheet ss:Name="' + name + '">';
            const WorksheetEnd = '</ss:Worksheet>';

            return WorksheetStart + Table + WorksheetEnd;
        }

        const myXMLTable = function (o) {
            let TableStart = '<ss:Table>';
            const TableEnd = '</ss:Table>';

            const tableData = JSON.parse(o);

            if (tableData.length > 0) {
                const columnHeader = Object.keys(tableData[0]);
                let rowData;
                for (let i = 0; i < columnHeader.length; i++) {
                    TableStart += myXMLColumn(columnWidth);

                }
                for (let j = 0; j < tableData.length; j++) {
                    rowData += myXMLRow(tableData[j], columnHeader);
                }
                TableStart += myXMLHead(1, columnHeader);
                TableStart += rowData;
            }

            return TableStart + TableEnd;
        }

        const myXMLColumn = function (w) {
            return '<ss:Column ss:AutoFitWidth="0" ss:Width="' + w + '"/>';
        }


        const myXMLHead = function (id, h) {
            let HeadStart = '<ss:Row ss:StyleID="' + id + '">';
            const HeadEnd = '</ss:Row>';

            for (let i = 0; i < h.length; i++) {
                const Cell = myXMLCell(h[i].toUpperCase());
                HeadStart += Cell;
            }

            return HeadStart + HeadEnd;
        }

        const myXMLRow = function (r, h) {
            let RowStart = '<ss:Row>';
            const RowEnd = '</ss:Row>';
            for (let i = 0; i < h.length; i++) {
                const Cell = myXMLCell(r[h[i]]);
                RowStart += Cell;
            }

            return RowStart + RowEnd;
        }

        const myXMLCell = function (n) {
            let CellStart = '<ss:Cell>';
            const CellEnd = '</ss:Cell>';

            const Data = myXMLData(n);
            CellStart += Data;

            return CellStart + CellEnd;
        }

        const myXMLData = function (d) {
            let DataStart = '<ss:Data ss:Type="String">';
            const DataEnd = '</ss:Data>';

            return DataStart + d + DataEnd;
        }

        const flatten = function (obj) {
            var obj1 = JSON.parse(JSON.stringify(obj));
            const obj2 = JSON.parse(JSON.stringify(obj));
            if (typeof obj === 'object') {
                for (var k1 in obj2) {
                    if (obj2.hasOwnProperty(k1)) {
                        if (typeof obj2[k1] === 'object' && obj2[k1] !== null) {
                            delete obj1[k1]
                            for (var k2 in obj2[k1]) {
                                if (obj2[k1].hasOwnProperty(k2)) {
                                    obj1[k1 + '-' + k2] = obj2[k1][k2];
                                }
                            }
                        }
                    }
                }
                var hasObject = false;
                for (var key in obj1) {
                    if (obj1.hasOwnProperty(key)) {
                        if (typeof obj1[key] === 'object' && obj1[key] !== null) {
                            hasObject = true;
                        }
                    }
                }
                if (hasObject) {
                    return flatten(obj1);
                } else {
                    return obj1;
                }
            } else {
                return obj1;
            }
        }

        return myExcelXML;
    })();

    const handelDownloadExcel = () => {
        const myTestXML = new myExcelXML(monthHistorys);
        myTestXML.downLoad();
    }

    return (
        <div >
            <h1 style={{ paddingTop: "20px", textTransform: 'uppercase', letterSpacing: '1.2px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                In the year
                <select id="year" name="year" onChange={e => setYear(new Date(e.target.value).getFullYear())} value={year}
                    style={{ padding: '4px', marginLeft: '4px' }}>
                    {
                        listYear.map(year => (
                            year
                        ))
                    }
                </select>
            </h1>
            <div>
                <div style={{ padding: '20px' }} id="printJS-form-SoldSale">
                    <h2 style={{ marginTop: "20px", textTransform: 'uppercase', letterSpacing: '1.2px' }}>Sale & Sold</h2>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                        <button type="button"
                            onClick={() => print({ printable: 'data', type: 'html', header: `Sale & Sold in ${year}` })}
                            style={{ background: "gray", padding: '4px 24px', borderRadius: '4px', color: '#fff', margin: '0px 4px 4px 0' }}>
                            <i className="fas fa-print"></i>
                            Print
                        </button>

                        <button onClick={handelDownloadExcel}
                            style={{ background: "gray", padding: '4px 24px', borderRadius: '4px', color: '#fff', margin: '0px 4px 4px 0' }}>
                            <i className="fas fa-file-excel"></i>
                            Export
                        </button>
                    </div>
                    <div style={{ height: '500px' }} id="data">
                        <ResponsiveContainer width="100%" height="100%" >
                            <LineChart
                                width={500}
                                height={300}
                                data={monthHistorys}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="sale" stroke="#8884d8" activeDot={{ r: 8 }} />
                                <Line yAxisId="right" type="monotone" dataKey="sold" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={{ padding: "20px" }} >
                    <h2 style={{ marginTop: "20px", textTransform: 'uppercase', letterSpacing: '1.2px', display: 'flex', alignItems: 'center' }}>
                        Products Sold In
                        <select value={month} onChange={e => setMonth(parseInt(e.target.value))}
                            style={{ padding: '8px', marginBottom: "4px", width: "120px" }}>
                            <option value={0}>Months</option>
                            {
                                months.map((month, index) => (
                                    <option key={index + 1} value={index + 1}>{month}</option>
                                ))
                            }
                        </select>
                    </h2>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="button"
                            onClick={() => print({ printable: 'tblData', type: 'html', header: `Product sold in ${year}` })}
                            style={{ background: "gray", padding: '4px 24px', borderRadius: '4px', color: '#fff', margin: '0px 4px  4px 0' }}>
                            <i className="fas fa-print"></i>
                            Print
                        </button>

                        <button onClick={() => exportTableToExcel('tblData', 'data')}
                            style={{ background: "gray", padding: '4px 24px', borderRadius: '4px', color: '#fff', margin: '0px 4px 4px 0' }}>
                            <i className="fas fa-file-excel"></i> 
                            Export
                        </button>
                    </div>

                    <div style={{ maxHeight: '500px', overflowY: "scroll" }} id="tblData">
                        <table className="table-user" >
                            <thead>
                                <tr>
                                    <th>Index</th>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Image</th>
                                    <th>Sold</th>
                                    <th>Sale</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    sumProductSold.map((product, index) => (
                                        <tr key={product._id} >
                                            <th>{index + 1}</th>
                                            <th>{product._id}</th>
                                            <th>{product.title}</th>
                                            <th><img style={{ height: "60px", objectFit: 'cover' }} src={product.img.url} alt={product.img.url}></img></th>
                                            <th>{product.sumQuantity}</th>
                                            <th>{product.sumPrice}</th>
                                        </tr>
                                    ))
                                }
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td >{sumQuantity}</td>
                                    <td >{sumPrice}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Charts
