import { useState, useEffect } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { crossIcon, rejectedIcon, rightTickIcon, warningBlock } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { defaultProfileDp } from "@/assets/images";
import { SelectInput } from "../form-components";
import DatePicker from "../reusable-components/date-picker";
import { shortRemarks } from "@/api/approval-api";

export default function ApprovalModalPopup({
    open,
    onOpenChange,
    data,
    onCloseModal,
    onSave,
    statusMapping,
    viewOnly = false,
    approvalByDate,
    setApprovalByDate
}) {
    const [action, setAction] = useState("Approved");
    const [remarks, setRemarks] = useState("");
    const [notes, setNotes] = useState("");
    const [shortRemarksOptions, setShortRemarksOptions] = useState([]);
    const [errors, setErrors] = useState({});

    // Clear errors when modal closes or action changes
    useEffect(() => {
        if (!open) setErrors({});
    }, [open]);

    useEffect(() => {
        setErrors((prev) => ({ ...prev, action: undefined, approvalByDate: undefined }));
    }, [action]);

    const validate = () => {
        const newErrors = {};

        if (!action) {
            newErrors.action = "Please select an approval action.";
        }

        if (!remarks) {
            newErrors.remarks = "Short remarks is required.";
        }

        if (!notes || !notes.trim()) {
            newErrors.notes = "Notes is required.";
        }

        if (action === "On Hold" && !approvalByDate) {
            newErrors.approvalByDate = "Approval by date is required when action is On Hold.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (viewOnly) return;
        if (!validate()) return;
        onSave({ id: data.id, action, remarks, notes });
    };

    const actions = [
        { label: "Declined", icon: rejectedIcon, color: "text-red-500" },
        { label: "On Hold", icon: warningBlock, color: "text-yellow-500" },
        { label: "Approved", icon: rightTickIcon, color: "text-green-500" },
    ];

    useEffect(() => {
        const fetchShortRemarks = async () => {
            const actionToUse = action || data?.status;
            const categoryToUse = data?.type;
            if (actionToUse && categoryToUse) {
                try {
                    const response = await shortRemarks(actionToUse, categoryToUse);
                    if (response?.success_key === 1 && Array.isArray(response?.data)) {
                        const options = response.data.map((remark) => ({
                            label: remark?.ch_short_remarks,
                            value: remark?.ch_short_remarks_id
                        }));
                        setShortRemarksOptions(options);
                    } else {
                        setShortRemarksOptions([]);
                    }
                } catch (error) {
                    setShortRemarksOptions([]);
                }
            } else {
                setShortRemarksOptions([]);
            }
        };
        if (open) fetchShortRemarks();
    }, [open, viewOnly, action, data?.type]);

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="h-[550px] max-w-4xl p-6 overflow-y-auto">
                {/* Header */}
                <AlertDialogHeader className="flex flex-row items-center justify-between">
                    <AlertDialogTitle>Approve</AlertDialogTitle>
                    <img src={crossIcon} alt="close" className="h-5 w-5 cursor-pointer" onClick={onCloseModal} />
                </AlertDialogHeader>

                {/* ===================== TOP INFO ===================== */}
                <div className="grid grid-cols-[1fr_49px_1fr_49px_1fr_49px_1fr_49px_1fr] text-sm mt-4 items-start">
                    <Info label="#ID" value={data.id} />
                    <Divider />

                    <Info label="Student" value={data.student} />
                    <Divider />

                    <Info label="Requested By" image={defaultProfileDp} value={data.requestedBy} />
                    <Divider />

                    {/* Status */}
                    <div className="w-full text-left">
                        <p className="text-sm font-semibold mb-2 text-[#6C757D]">Status</p>
                        <div
                            className={cn(
                                "ml-auto flex items-center gap-2 font-medium relative px-2 py-1 pl-7 rounded-[15px] h-[22px] text-sm max-w-[180px] min-w-max",
                                statusMapping[data?.status]?.bg || "bg-blue-50",
                                statusMapping[data?.status]?.color || ""
                            )}
                        >
                            <span className="absolute left-2 top-1/2 -translate-y-1/2">
                                <img src={statusMapping[data?.status]?.icon} alt={data?.status} className="w-4 h-4" />
                            </span>
                            <span className="pt-[0.5px] leading-0">{data?.status}</span>
                        </div>
                    </div>
                    <Divider />
                    <Info label="Type" textColor="#495057" value={data.type} />
                </div>

                {/* ===================== SECONDARY INFO ===================== */}
                <div className="grid grid-cols-[1fr_49px_1fr_49px_1fr_49px_1fr_49px_1fr_49px_1fr] text-sm mt-4 items-center">
                    <Info label="#Date Of Issue" value={data.issueDate} />
                    <Divider />
                    <Info label="Current Location" value={data?.current_location} />
                    <Divider />
                    <Info label="Req Location" value={data.requested_location} />
                    <Divider />
                    <Info label="Course" value={data?.course} />
                    <Divider />
                    <Info label="Center" value={data?.center} />
                </div>

                <Info label="Details" value={data?.long_remarks || "NA"} textColor="#000" />
                <div className="mt-2 w-full h-[1px] bg-[#CCDAFF]" />

                {/* ===================== APPROVALS ===================== */}
                <div className="mt-2">
                    <p className="font-semibold text-sm text-[#6C757D] mb-2">Approvals</p>
                    <RadioGroup className="flex gap-4" value={action} onValueChange={setAction}>
                        {actions.map((item, index) => (
                            <label
                                key={index}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer hover:border-gray-400 transition-colors ${
                                    errors.action ? "border-red-400" : "border-[#E4E8EF]"
                                } ${viewOnly ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                <RadioGroupItem value={item.label} disabled={viewOnly} />
                                <img src={item.icon} alt={item.label} className="w-5 h-5" />
                                <span className="text-md font-medium text-[#121212] capitalize">{item.label}</span>
                            </label>
                        ))}
                    </RadioGroup>
                    {errors.action && (
                        <p className="text-red-500 text-xs mt-1">{errors.action}</p>
                    )}
                </div>

                <div className="flex gap-3 items-start">
                    {/* Short Remarks */}
                    <div className="mt-2">
                        <div className="mb-2 flex items-center gap-1">
                            <p className="text-[#6C757D] font-semibold text-sm">
                                Short Remarks <span className="text-red-500">*</span>
                            </p>
                        </div>
                        <div className="w-[250px]">
                            <SelectInput
                                placeholder="Add short remarks here..."
                                className={`border rounded-lg p-2 w-full text-md font-medium text-[#121212] ${
                                    errors.remarks ? "border-red-400" : "border-[#E4E8EF]"
                                } ${viewOnly ? "opacity-50 cursor-not-allowed" : ""}`}
                                value={remarks}
                                onChange={(e) => {
                                    setRemarks(e.target.value);
                                    if (e.target.value) setErrors((prev) => ({ ...prev, remarks: undefined }));
                                }}
                                options={shortRemarksOptions}
                                disabled={shortRemarksOptions.length === 0 || viewOnly}
                            />
                            {errors.remarks && (
                                <p className="text-red-500 text-xs mt-1">{errors.remarks}</p>
                            )}
                        </div>
                    </div>

                    {/* Approval By Date (On Hold only) */}
                    {action === "On Hold" && (
                        <div className="mt-1">
                            <div className="mb-2 flex items-center gap-1">
                                <p className="text-[#6C757D] font-semibold text-sm">
                                    Approval By <span className="text-red-500">*</span>
                                </p>
                            </div>
                            <DatePicker
                                label=""
                                selectedDate={approvalByDate}
                                disablePast={true}
                                setSelectedDate={(date) => {
                                    setApprovalByDate(date);
                                    if (date) setErrors((prev) => ({ ...prev, approvalByDate: undefined }));
                                }}
                            />
                            {errors.approvalByDate && (
                                <p className="text-red-500 text-xs mt-1">{errors.approvalByDate}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Notes */}
                <div className="mt-2">
                    <p className="text-[#6C757D] font-semibold text-sm">
                        Add Notes <span className="text-red-500">*</span>
                    </p>
                    <Textarea
                        placeholder="Add your notes here..."
                        className={`border rounded-lg p-2 w-full text-md font-medium text-[#121212] mt-1 ${
                            errors.notes ? "border-red-400" : "border-[#E4E8EF]"
                        } ${viewOnly ? "opacity-50 cursor-not-allowed" : ""}`}
                        value={notes}
                        onChange={(e) => {
                            setNotes(e.target.value);
                            if (e.target.value.trim()) setErrors((prev) => ({ ...prev, notes: undefined }));
                        }}
                        disabled={viewOnly}
                    />
                    {errors.notes && (
                        <p className="text-red-500 text-xs mt-1">{errors.notes}</p>
                    )}
                </div>

                {/* ===================== FOOTER ===================== */}
                <div className="mt-2 flex justify-end gap-3">
                    <Button variant="outline" className="w-[16%]" onClick={onCloseModal}>Cancel</Button>
                    <Button onClick={handleSave} className="w-[16%]" disabled={viewOnly}>Save</Button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}

/* ===================== HELPERS ===================== */

const Info = ({ label, value, textColor = "#121212", image }) => (
    <div className="w-full text-left">
        <p className="text-sm font-semibold mb-2 min-w-max text-[#6C757D]">{label}</p>
        <p className={`font-medium flex items-center text-md min-w-max ${image ? 'justify-center gap-1' : ''}`} style={{ color: textColor }}>
            {image && <img src={image} alt="Image" className="w-5 h-5 rounded-xl" />} {value || "NA"}
        </p>
    </div>
);

const Divider = () => (
    <div className="flex h-full items-center justify-center">
        <div className="h-full w-[1px] bg-[#CCDAFF]" />
    </div>
);
