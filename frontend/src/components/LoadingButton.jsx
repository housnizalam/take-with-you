function LoadingButton({
  loading,
  children,
  loadingText = "Loading...",
  ...buttonProps
}) {
  return (
    <button
      {...buttonProps}
      disabled={loading || buttonProps.disabled}
    >
      {loading ? (
        <>
          <span className="button-spinner"></span>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default LoadingButton;